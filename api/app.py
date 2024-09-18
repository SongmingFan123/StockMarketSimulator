import os
from dotenv import load_dotenv
from flask import Flask, request, make_response, jsonify
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from bson import ObjectId
import datetime
import yfinance
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt
from flask_jwt_extended import JWTManager
import csv
import redis
ACCESS_EXPIRES = datetime.timedelta(hours=4)
app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
load_dotenv()

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

mongo_host = os.environ.get('MONGO_HOST', 'localhost')
mongo_port = int(os.environ.get('MONGO_PORT', 27017))
client = MongoClient(mongo_host, mongo_port)

redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
jwt_redis_blocklist = redis.StrictRedis(
    host=redis_host, port=redis_port, db=0, decode_responses=True
)

db = client.stock_trading_simulator_database
stocks = db.stocks
user_stock_portfolios = db.user_stock_portfolios
users = db.users
transactions = db.transactions
portfolios = db.portfolios
accounts = db.accounts
stocks = db.stocks

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None

@app.route('/api/verify-token')
@jwt_required()
def verify_token():
    return jsonify({"message" : "token is valid"}), 200

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        user_data = request.json
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        if not username or not email:
            return make_response(jsonify({"message": "Username, email, or password is missing"})), 400
        if users.find_one({'email': email}) is not None:
            return make_response(jsonify({"message": "An account with the email already exists"})), 409
        if users.find_one({'username': username}):
            return make_response(jsonify({'message': 'An account with the username already exists'}), 409)
        if len(password) < 8:
            return make_response(jsonify({'message': 'Password must be at least 8 characters long'}), 400)
        users.insert_one({'username': username, 'email': email, 'password': bcrypt.generate_password_hash(password), 'authentication_type': 'password'})
        user_id = users.find_one({'email': email})['_id']
        accounts.insert_one({'user_id': ObjectId(user_id), 'balance': 200000, 'created_at': datetime.datetime.now(), 'updated_at': datetime.datetime.now()})
        return make_response(jsonify({"message": "User Created Successfully"})), 200
    except Exception as e:
        return make_response(jsonify({"message": str(e)})), 500
    
@app.route('/api/signin', methods=['POST'])
def signin():
    try:
        user_data = request.json
        email = user_data['email']
        password = user_data['password']
        user = users.find_one({'email': email})
        if user is None or not bcrypt.check_password_hash(user['password'], password):
            return make_response(jsonify({"message": "Invalid email or password"})), 401
        user_id = user['_id']
        access_token = create_access_token(identity=str(user_id), expires_delta=ACCESS_EXPIRES)
        return jsonify(access_token=access_token), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred during sign-in"})), 500

@app.route('/api/signout', methods=['POST'])
@jwt_required()
def signout():
    try:
        jti = get_jwt()["jti"]
        jwt_redis_blocklist.set(jti, "", ex=ACCESS_EXPIRES)
        return jsonify(msg="Access token revoked"), 200
    except Exception as e:
        return make_response(jsonify({"message": "An error occurred during sign-out"})), 500

@app.route('/api/buy-stock', methods=['POST'])
@jwt_required()
def buy_stock():
    try:
        purchaseData = request.json
        user_id = get_jwt_identity()
        shares = purchaseData['shares']
        symbol = str(purchaseData['symbol']).upper()
        shares = int(shares)
        latest_stock_price = get_latest_stock_price(symbol=symbol)
        total_price = shares * latest_stock_price
        account = accounts.find_one({'user_id': ObjectId(user_id)})
        available_balance = account['balance']
        if shares <= 0:
            return make_response(jsonify({'message': 'Shares must greater than 0'})), 400
        if available_balance < total_price:
            return make_response(jsonify({'message': 'Insufficient balance to complete the transaction'})), 400
        accounts.update_one({'_id': account['_id']}, {'$set':{'balance': (available_balance - total_price)}})
        transactions.insert_one({'user_id': ObjectId(user_id), 'symbol': symbol, 'shares': shares, 'price': latest_stock_price, 'amount': total_price, 'type': 'buy', 'time': datetime.datetime.now()})
        portfolio = portfolios.find_one({'user_id': ObjectId(user_id), 'symbol': symbol})
        if portfolio:
            existing_shares = portfolio['shares']
            updated_average_cost = (portfolio['average_cost'] * portfolio['shares'] + shares * latest_stock_price) / (portfolio['shares'] + shares)
            updated_total_cost = portfolio['total_cost'] + total_price
            portfolios.update_one({'_id': portfolio['_id']}, {'$set': {'shares': (existing_shares + shares), 'average_cost': updated_average_cost, 'total_cost': updated_total_cost}})
        else:
            portfolios.insert_one({'user_id': ObjectId(user_id), 'symbol': symbol, 'shares': shares, 'average_cost': latest_stock_price, 'total_cost': total_price})
        return make_response(jsonify({'message': f'Buy transaction of {shares} shares of stock with symbol {symbol} with total price of {total_price} processed successfully.'})), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while processing the transaction'})), 500

@app.route('/api/sell-stock', methods=['POST'])
@jwt_required()
def sell_stock():
    try:
        purchaseData = request.json
        user_id = get_jwt_identity()
        shares = purchaseData['shares']
        symbol = str(purchaseData['symbol']).upper()
        shares = int(shares)
        latest_stock_price = get_latest_stock_price(symbol=symbol)
        total_price = shares * latest_stock_price
        portfolio = portfolios.find_one({'user_id': ObjectId(user_id), 'symbol': symbol})
        account = accounts.find_one({'user_id': ObjectId(user_id)})
        available_balance = account['balance']
        if shares <= 0:
            return make_response(jsonify({'message': 'Shares must greater than 0'})), 400
        if portfolio is None:
            return make_response(jsonify({'message': 'Not currently holding any shares of the stock.'})), 400
        if portfolio['shares'] < shares:
            return make_response(jsonify({'message': 'Number of shares sold cannot be greater than shares currently holding.'})), 400
        accounts.update_one({'_id': account['_id']}, {'$set':{'balance': (available_balance + total_price)}})
        transactions.insert_one({'user_id': ObjectId(user_id), 'symbol': symbol, 'shares': shares, 'total_price': total_price, 'type': 'sell', 'time': datetime.datetime.now()})
        updated_shares = portfolio['shares'] - shares
        if updated_shares == 0:
            portfolios.delete_one({'_id': portfolio['_id']})
            return make_response(jsonify({'message': 'All shares sold successfully.'})), 200
        updated_average_cost = (portfolio['average_cost'] * portfolio['shares'] - shares * latest_stock_price) / (portfolio['shares'] - shares)
        updated_total_cost = portfolio['total_cost'] - total_price
        portfolios.update_one({'_id': portfolio['_id']}, {'$set': {'shares': updated_shares, 'average_cost': updated_average_cost, 'total_cost': updated_total_cost}})
        return make_response(jsonify({'message': f'Sell transaction of {shares} shares of stock with symbol {symbol} processed successfully.'})), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while processing the transaction.'})), 500
    
@app.route('/api/portfolio', methods=['GET'])
@jwt_required()
def portfolio():
    try:
        user_id = get_jwt_identity()
        portfolio_list = list(portfolios.find({'user_id': ObjectId(user_id)}, {'user_id': 0, '_id': 0}))
        for portfolio in portfolio_list:
            market_value = get_latest_stock_price(portfolio['symbol'])
            total_cost = portfolio['total_cost']
            total_market_value = portfolio['shares'] * market_value
            portfolio['percentage_gain_loss'] = calculate_percentage_gain_loss(market_value=total_market_value, cost=total_cost)
            portfolio['total_market_value'] = total_market_value
        return jsonify({'portfolio': portfolio_list}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the portfolio data.'})), 500


@app.route('/api/stock-transactions', methods=['GET'])
@jwt_required()
def stock_transactions():
    try:
        user_id = get_jwt_identity()
        user_transactions = list(transactions.find({'user_id': ObjectId(user_id)}, {'user_id': 0, '_id': 0}))
        for transaction in user_transactions:
            transaction['time'] = transaction['time'].strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({'transactions': user_transactions}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the transactions.'})), 500

@app.route('/api/stock-position/<symbol>', methods=['GET'])
@jwt_required()
def stock_position(symbol):
    try:
        if not symbol:
            return make_response(jsonify({'message': 'Stock symbol is required.'})), 400
        symbol = symbol.upper()
        user_id = get_jwt_identity()
        portfolio = portfolios.find_one({'user_id': ObjectId(user_id), 'symbol': symbol})
        return jsonify({'shares': portfolio['shares']}) if portfolio else jsonify({'shares': 0}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the stock positions.'})), 500

@app.route('/api/leaderboard/', methods=['GET'])
@jwt_required()
def leaderboard():
    try:
        summary_list = []
        for user in users.find():
            user_id = ObjectId(user['_id'])
            username = user['username']
            portfolio_list = portfolios.find({'user_id': user_id}, {'user_id': 1, 'shares': 1, 'total_cost': 1, 'symbol': 1})
            total_market_value = 0
            total_cost = 0
            for portfolio in portfolio_list:
                shares = portfolio['shares']
                cost = portfolio['total_cost']
                symbol = portfolio['symbol']
                market_value = get_latest_stock_price(symbol)
                total_market_value += shares * market_value
                total_cost += cost
            profit = round(total_market_value - total_cost, 2)
            gain_loss_percentage = calculate_percentage_gain_loss(total_market_value, total_cost)
            summary_list.append({'username': username, 'totalProfit': profit, 'gainLossPercentage': gain_loss_percentage})
        summary_list.sort(key=lambda summary: summary['gainLossPercentage'], reverse=True)
        return jsonify(summary_list), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the leaderboard.'})), 500

@app.route('/api/search-stock/<query>', methods=['GET'])
@jwt_required()
def search_stock(query):
    try:
        query = str(query)
        stock_list = list(stocks.find({'$or':[{'Symbol' : {"$regex" : query, "$options": "i"}}, {'Name' : {"$regex" : query, "$options": "i"}}]}, {'Symbol': 1, 'Name': 1, '_id': 0}).limit(10))
        return jsonify({'stock_list': stock_list}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while searching for stocks.'}), 500)

@app.route('/api/account-balance', methods=['GET'])
@jwt_required()
def get_account_balance():
    try:
        user_id = get_jwt_identity()
        balance = round(accounts.find_one({'user_id': ObjectId(user_id)})['balance'], 2)
        return jsonify({'balance': balance}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the account balance.'}), 500)

@app.route('/api/update-password', methods=['PUT'])
@jwt_required()
def update_password():
    try:
        user_id = get_jwt_identity()
        password = request.json.get('password')
        if not password:
            return make_response(jsonify({'message': 'Password cannot be blank'}), 400)
        if len(password) < 8:
            return make_response(jsonify({'message': 'Password cannot be blank'}), 400)
        users.update_one({'_id': ObjectId(user_id)},{'$set': {'password' : bcrypt.generate_password_hash(password)}})
        return make_response(jsonify({'message': 'Password updated successfully'}), 200)
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while updating the password.'}), 500)

@app.route('/api/update-username', methods=['PUT'])
@jwt_required()
def update_username():
    try:
        user_id = get_jwt_identity()
        username = request.json.get('username')
        if not username:
            return make_response(jsonify({'message': 'Username cannot be blank'}), 400)
        if users.find_one({'username': username, '_id': {'$ne': ObjectId(user_id)}}):
            return make_response(jsonify({'message': 'Username is already taken'}), 409)
        users.update_one({'_id': ObjectId(user_id)}, {'$set': {'username': username}})
        return make_response(jsonify({'message': 'Username updated successfully'}), 200)
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while updating the username.'}), 500)

@app.route('/api/stock_price_data/<symbol>/<period>', methods=['GET'])
def stock_price_data(symbol, period):
    try:
        yfinance.Ticker(symbol).info['currentPrice']
        return jsonify({'stock_price_data': get_stock_price_data(symbol=symbol, period=period)}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching stock price data'}), 404)

@app.route('/api/stock_info_data/<symbol>', methods=['GET'])
def stock_info_data(symbol):
    try:
        stock_info = yfinance.Ticker(symbol).info
        filtered_stock_info = {
            'totalRevenue': stock_info.get('totalRevenue', 'N/A'),
            'profitMargins': stock_info.get('profitMargins', 'N/A'),
            'marketCap': stock_info.get('marketCap', 'N/A'),
            'longBusinessSummary': stock_info.get('longBusinessSummary', 'N/A'),
            'trailingPE': stock_info.get('trailingPE', 'N/A'),
            'forwardPE': stock_info.get('forwardPE', 'N/A'),
            'open': stock_info.get('open', 'N/A'),
            'dayHigh': stock_info.get('dayHigh', 'N/A'),
            'dayLow': stock_info.get('dayLow', 'N/A'),
            'volume': stock_info.get('volume', 'N/A')
        }
        return jsonify({'stock_info_data': filtered_stock_info}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching stock information.'}), 500)

@app.route('/api/latest-stock-price/<symbol>', methods=['GET'])
@jwt_required()
def latest_stock_price(symbol):
    try:
        return jsonify({'latest_stock_price': get_latest_stock_price(symbol)}), 200
    except Exception as e:
        return make_response(jsonify({'message': 'An error occurred while fetching the latest stock price.'}), 500)
    
def calculate_percentage_gain_loss(market_value, cost):
    if cost == 0:
        return 0
    return round((market_value-cost) / cost * 100, 2)

def get_latest_stock_price(symbol):
    data = get_stock_price_data(symbol=symbol,period='1d')
    return data[-1]['Close']

def get_stock_price_data(symbol, period):
    stock_price_data = yfinance.download(symbol, period=period, interval='1d')
    if period == '1d' or period == '5d':
        stock_price_data = yfinance.download(symbol, interval='1m', period=period)
        stock_price_data.reset_index(inplace=True)     
        stock_price_data['Time'] = stock_price_data['Datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
        stock_price_data.drop(columns=['Datetime'], inplace=True)
        return list(stock_price_data.to_dict(orient='records'))
    stock_price_data.reset_index(inplace=True)
    stock_price_data['Time'] = stock_price_data['Date'].dt.strftime('%Y/%m/%d')
    stock_price_data.drop(columns=['Date'], inplace=True)
    return list(stock_price_data.to_dict(orient='records'))

def csv_to_json(csv_file_path):
    json_data = []
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            json_data.append({key: row[key] for key in ['Symbol', 'Name']})
    return json_data

# To load stock info data from csv to mongodb, uncomment the following line of code and replace file path with the absolute file path to nasdaq_stock_info.csv
# comment out the line of code after insertion

# stocks.insert_many(csv_to_json('filepath'))

if __name__ == '__main__':
    app.run(debug=True)
