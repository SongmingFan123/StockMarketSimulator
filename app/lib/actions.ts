"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    if (!response.ok) {
      const {message} = await response.json();
      return { message: message }
    }
    const { access_token } = await response.json();
    cookies().set("token", access_token);
    
  } catch (error) {
    return { message: "Error Occurred! Failed to Sign In" }
  }
  redirect("/dashboard/trade");
};
export const signUp = async (previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    if (!response.ok) {
      const {message} = await response.json();
      return { message: message };
    }
    const { access_token } = await response.json();
    cookies().set("token", access_token);
  } catch (error) {
    return {success: false, message: "Error Occurred! Failed to Sign Up" };
  }
  redirect("/dashboard/trade");
};
export const signout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      return { success: false };
    }
    const { message } = await response.json();
    cookies().delete("token");
    return { success: true};
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Sign Out",
    };
  }
};
export const updatePassword = async (previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        password: formData.get("password"),
      }),
    });
    const {message} = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Update Password",
    };
  }
};
export const updateUsername = async (previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        username: formData.get("username"),
      }),
    });
    const {message} = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Update Username",
    };
  }
};
export const searchStock = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/search-stock?query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(response.status);
      return { success: false, data };
    }
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Fetch Stocks",
    };
  }
};
export const sellStock = async (symbol: string, previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/sell-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        symbol: symbol,
        shares: formData.get("quantity"),
      }),
    });
    const {message} = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Process Transaction",
    };
  }
};
export const buyStock = async (symbol: string, previousState: any, formData: FormData) => {
  try {
    const response = await fetch("http://localhost:5000/api/buy-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        symbol: symbol,
        shares: formData.get("quantity"),
      }),
    });
    const {message} = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Process Transaction",
    };
  }
};
export const getStockInfoData = async (symbol: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/stock_info_data?symbol=${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred! Failed to Process Transaction",
    };
  }
};
export const getStockPriceData = async (symbol: string, period: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/stock_price_data?symbol=${symbol}&period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    if (!response.ok) {
      if(response.status === 404){
        return undefined;
      }
      const {message} = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred"
    };
  }
};
export const getAccountBalance = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/account-balance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Error Occurred" };
  }
};
export const getStockPositions = async (symbol: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/stock-positions?symbol=${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );

    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Error Occurred" };
  }
};
export const getLatestStockPrice = async (symbol: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/latest-stock-price?symbol=${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );

    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Error Occurred" };
  }
};
export const getLeaderboardData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/leaderboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message};
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred",
    };
  }
};
export const getSearchStockData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/search-stock`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message};
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred",
    };
  }
};
export const getTransactionData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/transactions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message};
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred",
    };
  }
};
export const getPortfolioData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/portfolio`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    if (!response.ok) {
      const {message} = await response.json();
      return { success: false, message};
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "Error Occurred",
    };
  }
};
