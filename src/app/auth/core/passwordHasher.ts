import crypto from 'crypto'

export function hashPassowrd(password: string, salt: string): Promise<string>{
    return new Promise((resolve,reject) => {
        crypto.scrypt(password.normalize(), salt,64 , (error ,hash) => {
            if(error) reject(error)
            resolve(hash.toString('hex').normalize())
        });
    })
}

export function generateSalt(){
    return crypto.randomBytes(16).toString("hex").normalize();
}