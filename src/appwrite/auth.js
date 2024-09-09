import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

   
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) 
            .setProject(conf.appwriteProjectId) 
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // Attempt to retrieve the current user
            const user = await this.account.get();
            return user;
        } catch (error) {
            // Enhanced error handling
            console.error("Appwrite service :: getCurrentUser :: Error:", error.message);
    
            // General handling for invalid parameters
            if (error.message.includes('Invalid `userId` param')) {
                console.error("The `userId` parameter might be invalid. Please ensure it adheres to the required format.");
            } else {
                console.error("An unexpected error occurred:", error.message);
            }
    
            return null;
        } 
    }
    

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService