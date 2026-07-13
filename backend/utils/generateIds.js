const generateBookingId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(100 + Math.random() * 900);
  return `BK${timestamp}${random}`;
};

const generateTransactionId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(100 + Math.random() * 900);
  return `TXN${timestamp}${random}`;
};

module.exports = { generateBookingId, generateTransactionId };
