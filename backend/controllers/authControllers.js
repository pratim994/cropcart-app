const {pool} = require('../config/db') ;
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your secret key';
exports.register = async(req, res)=>{
    try{
        const{name, email,password, phone, user_type, location} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const conn =  await pool.getConnection();
        await conn.execute(
            'INSERT INTO users (name, email, password, phone, user_type, location) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email,password, phone, user_type, location]
        );
        conn.release();
        res.status(201).json({message:'user registered successfully'});
    }
    catch (err){
        if(err.code =='ER_DUP_ENTRY'){
            return res.status(400).json({message:'email already exists'});
        }
        return res.status(500).json({message:' registration failed'});
    }
};

exports.login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const conn  =  await pool.getConnection()
        const [users] = await conn.execute('SELECT* from users where EMAIL = ?', [email]);
        conn.release(); 
        const user = users[0];
        if(!user || !(await bcrypt.compare(password, user.password))){
                return res.status(401).json({message :'invalid credentials if you try hacking I will take you to jail'});
        }
        const token = jwt.sign(
            {id: user.id, email: user.email, user_type :user.user_type},
            JWT_SECRET,
            {expiresIn: '24hr'}
        );
        res.json({
            token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                location: user.location,
            },
        });
    }
    catch (err){
            res.status(501).json({message: 'login failed'});
    }
    
};