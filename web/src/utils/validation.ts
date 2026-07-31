export const MIN_PASSWORD_LENGTH = 8

export function isValidEmail(email:string):boolean{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function hasPasswordNumber(password: string): boolean {
    return /\d/.test(password)
}

export function isValidPassword(password: string): boolean {
    return password.length >= MIN_PASSWORD_LENGTH && hasPasswordNumber(password)
}