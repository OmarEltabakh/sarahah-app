
export const genderEnum = {
    female: 'female',
    male: 'male'
}

export const roleEnum = {
    user: 'user',
    admin: 'admin',
}

export const privilegeEnum = {
    user_admin:[roleEnum.user,roleEnum.admin],
    user:[roleEnum.user],
    admin:[roleEnum.admin]
}

export const skillsLevelEnum={
    beginner:'beginner',
    intermediate:'intermediate',
    expert:'expert'
}   

export const providerEnum={
    google:'google',
    local:'local'
}