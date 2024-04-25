const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const createCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });

    res.status(200).send(customer);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const addNewCard = async (req, res) => {
  try {
    const {
      customer_id,
      card_Name,
      card_ExpYear,
      card_ExpMonth,
      card_Number,
      card_CVC,
    } = req.body;

    const card_token = await stripe.tokens.create({
      card: {
        name: card_Name,
        number: card_Number,
        exp_year: card_ExpYear,
        exp_month: card_ExpMonth,
        cvc: card_CVC,
      },
    });

    const card = await stripe.customers.createSource(customer_id, {
      source: `${card_token.id}`,
    });

    res.status(200).send({ card: card.id });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const createCharges = async (req, res) => {
  try {
    const createCharge = await stripe.charges.create({
      receipt_email: "tester@gmail.com",
      amount: parseInt(req.body.amount) * 100, //amount*100
      currency: "INR",
      card: req.body.card_id,
      customer: req.body.customer_id,
    });

    res.status(200).send(createCharge);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const createCheckout = async (req, res) => {
  try {
    const { products } = req.body;
    console.log(products);
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: product.name,
          images: [product.image],
          description: product.description,
        },
        unit_amount: product.price,
      },

      quantity: product.cartQuantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
module.exports = {
  createCustomer,
  addNewCard,
  createCharges,
  createCheckout,
};
