const db = require("../config/db.config");


exports.insertProperty = async ({
  title,
  description,
  price,
  city,
  address,
  category_id,
  agent_id
}) => {

  const [result] = await db.query(

    `INSERT INTO properties
     (title,description,price,city,address,category_id,agent_id)
     VALUES (?,?,?,?,?,?,?)`,

    [
      title,
      description,
      price,
      city,
      address,
      category_id,
      agent_id
    ]
  );

  return { id: result.insertId };

};



exports.findProperties = async ({offset,limit,status,city,search}) => {

  let q = `
  SELECT
  p.*,
  u.name as agent_name
  FROM properties p
  JOIN users u ON p.agent_id=u.id
  WHERE 1=1
  `;

  const params=[]

  if(status){
    q+=` AND p.status=?`
    params.push(status)
  }

  if(city){
    q+=` AND p.city=?`
    params.push(city)
  }

  if(search){
    q+=` AND p.title LIKE ?`
    params.push(`%${search}%`)
  }

  q+=` LIMIT ? OFFSET ?`

  params.push(limit,offset)

  const [rows]=await db.query(q,params)

  return rows

}


exports.countProperties = async ({status,city,search}) => {

  let q=`SELECT COUNT(*) as total FROM properties WHERE 1=1`
  const params=[]

  if(status){
    q+=` AND status=?`
    params.push(status)
  }

  if(city){
    q+=` AND city=?`
    params.push(city)
  }

  const [[row]]=await db.query(q,params)

  return row.total
}


exports.deleteProperty = async (id)=>{

  await db.query(
    `DELETE FROM properties WHERE id=?`,
    [id]
  )

}