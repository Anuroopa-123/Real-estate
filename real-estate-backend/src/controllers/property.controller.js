const propertyService = require("../services/property.service");

exports.createProperty = async (req, res) => {
  try {

    const property = await propertyService.createProperty(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: property
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};


exports.getProperties = async (req, res) => {

  const { page = 1, limit = 10, status, city, search } = req.query;

  const data = await propertyService.getProperties({
    page:+page,
    limit:+limit,
    status,
    city,
    search
  });

  res.json({ success:true, ...data });

};


exports.deleteProperty = async (req,res)=>{

  await propertyService.deleteProperty(req.params.id)

  res.json({
    success:true,
    message:"Property deleted"
  })

}