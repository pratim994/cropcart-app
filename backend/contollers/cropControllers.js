const {pool} = require('../config/db')

exports.getAllCrops = async (req, res) =>{
        try{
            const {search, farmer_id} =req.query;
            let query =`
              SELECT c.*, u.name as farmer_name, u.phone as farmer_phone, u.location as farmer_location
              FROM crops c 
             JOIN users u ON c.farmer_id = u.id 
            WHERE c.quantity_available > 0`
            ;
            const params = [];
            if(search){
                query += `AND c.farmer_id = ?`;
                params.push(farmer_id);
            }
            query += ' ORDER BY c.created_at DESC';
            const conn = await pool.getConnection();
            const [crops] = await conn.execute(query, params);
            conn.release();
            res.json(crops);

             
        }
        catch(error){
            res.status(500).json({error: 'failed to fetch crops'});
        }
};

exports.getCropsById = async(req, res)=>{
    try{
        const conn = await pool.getConnection();
        const [crops] = await conn.execute(`
      SELECT c.*, u.name as farmer_name, u.phone as farmer_phone, u.location as farmer_location
      FROM crops c 
      JOIN users u ON c.farmer_id = u.id 
      WHERE c.id = ?
    `,[req.params.id]);
    conn.release();
    if(crops.length()==0){
        return res.status(404).json({error: 'crops not found'});
    }
    res.json(crops[0]);
    } catch(error){
        return res.status(500).json({error: 'failed to fetch crop'});
    }
};

exports.addCrops = async(req, res)=>{
    try{
        if(req.user.user_type !== 'farmer'){
            return res.status(403).json({error: 'only farmers can add crops'});
        }
        const {name, description, price, quantity_available,grade, harvest_date} = req.body;
        const image_url = req.file ?`/uploads/${req.file.filename}` : null;
        const conn = await pool.getConnection();
        const [result] = await conn.execute(
             'INSERT INTO crops (farmer_id, name, description, price, quantity_available, grade, harvest_date, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, name, description, price, quantity_available, grade, harvest_date,image_url]
        );
        conn.release();
        res.status(201).json({id: result.insertId, message: 'crops inserted successfully'});

    }catch(error){
        res.status(500).json({error: 'failed to add crops'});
    }
};

exports.updateCrops = async(req, res)=>{
    try{
        if(req.user.user_type!=='farmer'){
        return    res.status(403).json({error: 'only farmers can update crops'});
        }
            const {name, description, price, quantity_available,grade,} = req.body;
            const conn = await pool.getConnection();
            await conn.execute(
              'UPDATE crops SET name = ?, description = ?, price = ?, quantity_available = ?, grade = ? WHERE id = ? AND farmer_id = ?',
              [name, description, price, quantity_available,grade,req.params.id, req.user.id]  
            );
            conn.release();          
            res.json({message: 'crops updated successfully '});
    }
    catch(error){
        res.status(500).json({error: 'failed to update crops'})
    }
};

exports.getFarmerCrops = async (req, res) =>{
    try{
        if(res.user.user_type!=='farmer'){
            return res.status(403).json({error: 'access denied'});
        }
        const conn = await pool.getConnection();
        const [crops] = await conn.execute(
               'SELECT * FROM crops WHERE farmer_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        conn.release();
        res.json(crops);
    }
    catch(error){
        res.status(500).json({error: 'failed to fetch crops'});
    }

};