const router = require("express").Router();
const { Order, User, Cart, Product } = require("../db");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const cart = await Cart.findAll({
      where: {
        orderId: orderId,
      },
    });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.put("/:productId/:userId", async (req, res, next) => {
  const product = await Product.findByPk(req.params.productId);
  const user = await User.findByPk(req.params.userId, {
    include: Order,
    where: {
      isComplete: false,
    },
  });
  const order = user.orders[0];
  const newProduct = await order;
});

// router.put("/:productId/:orderId", async (req, res, next) => {
//   const order = await Order.findByPk(req.params.orderId);
//   const productId = await Product.findByPk(req.params.productId);
//   console.log("THIS IS THE PRODUCT ID", productId);
//   if (order) {
//     try {
//       const orderUpdate = Order.update({ productId });
//       res.status(201).json(orderUpdate);
//     } catch (error) {
//       next(error);
//     }
//   }
// });

router.put("/:productId", async (req, res, next) => {
  try {
    if (req.user) {
      let order = await Order.findOne({
        where: {
          userId: req.user.id,
          isComplete: false,
        },
      });
    } else {
      order = await Order.create();
    }
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
      },
    });
    order.addProduct(product);
    res.send(order);
  } catch (error) {
    next(error);
  }
});
