const propertyRepository = require("../repositories/property.repository");
const { paginate } = require("../utils/pagination.util");

exports.createProperty = async (body, adminId) => {

  const {
    title,
    description,
    price,
    city,
    address,
    category_id
  } = body;

  if (!title || !price || !category_id) {
    throw new Error("Title, price and category are required");
  }

  return propertyRepository.insertProperty({
    title,
    description,
    price,
    city,
    address,
    category_id,
    agent_id: adminId
  });

};



exports.getProperties = async ({ page, limit, status, city, search }) => {

  const { offset } = paginate(page, limit);

  const [rows, total] = await Promise.all([
    propertyRepository.findProperties({ offset, limit, status, city, search }),
    propertyRepository.countProperties({ status, city, search })
  ]);

  return {
    data: rows,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };

};



exports.deleteProperty = async (id) => {

  await propertyRepository.deleteProperty(id);

};