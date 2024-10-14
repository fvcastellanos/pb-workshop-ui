
import { AuthModel } from 'pocketbase';
import pb from './pocketbase';

export async function login(email: string, password: string): Promise<AuthModel> {
    try {

        await pb.collection('users')
            .authWithPassword(email, password);
        
        return pb.authStore.model;

    } catch (error) {
        throw error;
    }
}

export function logout() {
    pb.authStore.clear();
}
