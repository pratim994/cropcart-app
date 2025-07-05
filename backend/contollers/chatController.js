const {pool} =  require('../config/db');

exports.sendMessage = async(req, res)=>{
    try{
        const {farmer_id, customer_id, message} =  req.body ;
        const sender_type = req.user.user_type;
        const conn =  await pool.getConnection();
        await conn.execute(
             'INSERT INTO chats (customer_id, farmer_id, message, sender_type) VALUES (?, ?, ?, ?)',
             [customer_id||req.user.id, farmer_id|| req.user.id, message, sender_type]
        );
        conn.release();
        res.status(201).json({message:' message sent successfully'});
    }   
    catch(err){
        res.status(500).json({message:'failed to send message'});
    }

};

exports.getMessages = async(req, res)=>{
    try{
        const{farmer_id,customer_id} =  req.params;
        const conn = await pool.getConnection();
        const[messages] = await conn.execute(
            'SELECT * FROM chats WHERE farmer_id = ? AND customer_id = ? ORDER BY created_at ASC',
            [farmer_id,customer_id]
        );
        conn.release();
        res.json(messages);
    }
    catch(err){
        res.status(500).json({message: 'failed to fetch messages'});
    }
};