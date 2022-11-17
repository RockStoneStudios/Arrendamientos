import bcrypt from 'bcrypt';

const usuarios = [
     {
        nombre: 'Elon Reeve Musk',
        email: 'ElonMusk@gmail.com',
        confirmado: 1,
        password : bcrypt.hashSync('password',10)
     }
]

export default usuarios;