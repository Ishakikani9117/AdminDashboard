import { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                    }
                  }
                `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
        message: "logged in",
      };
      
    } catch (e) {
      const error = e as Error;
      console.log(error);

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check : async () => {
    try {
      const token = localStorage.getItem("access_token");
  
      if (!token) {
        throw new Error("No access token found");
      }
  
      const response = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });
  
      // Ensure response is valid and contains the expected data
      if (response && response.data && response.data.me) {
        return {
          authenticated: true,
          redirectTo: "/",
        };
      }else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      // Assert the error type
      /*let errorMessage = "Authentication failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }
  */
      console.log('Error:', error); // Debugging log
      return {
        authenticated: false,
       // message: errorMessage,
        redirectTo: "/login",
      };
    }
  }
   ,
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                            id,
                            name,
                            email,
                            phone,
                            jobTitle,
                            timezone
                            avatarUrl
                        }
                      }
                `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};