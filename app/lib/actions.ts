"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SignInFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, {
      message: "Password is required and should be at least 8 characters long",
    }),
});

const SignUpFormSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
const UpdateUsernameFormSchema = z.object({
  username: z.string().min(1, { message: "Username can't be blank" }),
});
const UpdatePasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
export const signIn = async (previousState: any, formData: FormData) => {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/signin`, {
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
      const { message } = await response.json();
      return { errors: null, message: message };
    }
    const { access_token } = await response.json();
    cookies().set("token", access_token);
  } catch (error) {
    return { errors: null, message: "An error occurred! Failed to Sign In" };
  }
  redirect("/dashboard/trade");
};
export const signUp = async (previousState: any, formData: FormData) => {
  const validatedFields = SignUpFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields",
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/signup`, {
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
      const { message } = await response.json();
      return { errors: null, message: message };
    }
    const { access_token } = await response.json();
    cookies().set("token", access_token);
  } catch (error) {
    return { errors: null, message: "An error occurred! Failed to Sign Up" };
  }
  redirect("/dashboard/trade");
};
export const signout = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/signout`, {
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
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred! Failed to Sign Out",
    };
  }
};
export const updatePassword = async (
  previousState: any,
  formData: FormData
) => {
  const validatedFields = UpdatePasswordFormSchema.safeParse({
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        password: formData.get("password"),
      }),
    });
    const { message } = await response.json();
    if (!response.ok) {
      return { errors: null, success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      errors: null,
      success: false,
      message: "An error occurred! Failed to Update Password",
    };
  }
};
export const updateUsername = async (
  previousState: any,
  formData: FormData
) => {
  const validatedFields = UpdateUsernameFormSchema.safeParse({
    username: formData.get("username"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/update-username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify({
        username: formData.get("username"),
      }),
    });
    const { message } = await response.json();
    if (!response.ok) {
      return { errors: null, success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      errors: null,
      success: false,
      message: "An error occurred! Failed to Update Username",
    };
  }
};
export const searchStock = async (query: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/search-stock/${query}`,
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
      message: "An error occurred! Failed to Fetch Stocks",
    };
  }
};
export const sellStock = async (
  symbol: string,
  previousState: any,
  formData: FormData
) => {
  try {
    const response = await fetch(`${apiUrl}/api/sell-stock`, {
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
    const { message } = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred! Failed to Process Transaction",
    };
  }
};
export const buyStock = async (
  symbol: string,
  previousState: any,
  formData: FormData
) => {
  try {
    const response = await fetch(`${apiUrl}/api/buy-stock`, {
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
    const { message } = await response.json();
    if (!response.ok) {
      return { success: false, message };
    }
    return { success: true, message };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred! Failed to Process Transaction",
    };
  }
};
export const getStockInfoData = async (symbol: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/stock_info_data/${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred! Failed to Process Transaction",
    };
  }
};
export const getStockPriceData = async (symbol: string, period: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/stock_price_data/${symbol}/${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      const { message } = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};
export const getAccountBalance = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/account-balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "An error occurred" };
  }
};
export const getStockPosition = async (symbol: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/stock-position/${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );

    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "An error occurred" };
  }
};
export const getLatestStockPrice = async (symbol: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/latest-stock-price/${symbol}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );

    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message: message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "An error occurred" };
  }
};
export const getLeaderboardData = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/leaderboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};
export const getSearchStockData = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/search-stock`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};
export const getTransactionData = async () => {
  try {
    const response = await fetch(
      `${apiUrl}/api/stock-transactions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};
export const getPortfolioData = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/portfolio`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
    };
  }
};
