const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// custom middlewares

const verifyFBToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
 
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  // verify the token
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "forbidden access" });
  }
  // next();
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email };
  const user = await usersCollection.findOne(query);
  if (!user || user.role !== "Admin") {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};
const verifyBuyer = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email };
  const user = await usersCollection.findOne(query);
  if (!user || user.role !== "Buyer") {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};
const verifyWorker = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email };
  const user = await usersCollection.findOne(query);
  if (!user || user.role !== "Buyer") {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

// Middleware
app.use(cors());
app.use(express.json());
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynozyvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const microTaskDB = client.db("microTaskDB");
    const usersCollection = microTaskDB.collection("users");
    const tasksCollection = microTaskDB.collection("tasks");
    const paymentsCollection = microTaskDB.collection("payments");
    const submissionsCollection = microTaskDB.collection("submission");
    const withdrawalsCollection = microTaskDB.collection("withdrawals");
    const notificationsCollection = microTaskDB.collection("notifications");
    // User Data Post
    // ✅ Add task
    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;

        // Optional: Validate required fields
        const requiredFields = [
          "task_title",
          "task_detail",
          "required_workers",
          "payable_amount",
          "completion_date",
          "submission_info",
          "task_image_url",
        ];
        for (const field of requiredFields) {
          if (!task[field]) {
            return res.status(400).json({ message: `Missing field: ${field}` });
          }
        }

        // Add default status and createdAt if not provided
        task.status = task.status || "pending";
        task.createdAt = task.createdAt || new Date();

        const result = await tasksCollection.insertOne(task);
        res.status(201).json({
          message: "Task created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Failed to add task" });
      }
    });

    app.get("/tasks", async (req, res) => {
      const email = req.query.creator_email;
      const query = {};
      if (email) {
        query.creator_email = email;
      } /*  */
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/submissions/check", async (req, res) => {
      const { taskId, email } = req.query;
      const exists = await submissionsCollection.findOne({
        task_id: taskId,
        worker_email: email,
      });
      res.send({ exists: !!exists });
    });
    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;

        const existingUser = await usersCollection.findOne({
          email: userData.email,
        });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

        const result = await usersCollection.insertOne(userData);
        if (result.insertedId) {
          return res.status(201).json({ insertedId: result.insertedId });
        }
        res.status(500).json({ message: "Failed to create user" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.status(200).json(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    // user data get
    app.get("/users/:email/role", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send({ role: user?.role });
    });
    // POST: Worker withdrawal
    app.post("/withdrawals", async (req, res) => {
      try {
        const {
          worker_email,
          worker_name,
          withdrawal_coin,
          withdrawal_amount,
          payment_system,
          account_number,
        } = req.body;

        if (
          !worker_email ||
          !worker_name ||
          !withdrawal_coin ||
          !withdrawal_amount ||
          !payment_system ||
          !account_number
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const withdrawData = {
          worker_email,
          worker_name,
          withdrawal_coin,
          withdrawal_amount,
          payment_system,
          account_number,
          withdraw_date: new Date(),
          status: "pending",
        };

        const result = await withdrawalsCollection.insertOne(withdrawData);

        res.status(201).json({
          message: "Withdrawal request submitted",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Withdrawal error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/withdrawals", async (req, res) => {
      const email = req.query.worker_email;

      try {
        const query = {};

        if (email) {
          query.worker_email = email;
        }

        const result = await withdrawalsCollection
          .find(query)
          .sort({ withdraw_date: -1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.patch("/users", async (req, res) => {
      const { email, coins } = req.body;

      // ✅ Basic Validation
      if (!email || typeof coins !== "number") {
        return res
          .status(400)
          .send({ message: "Valid email and coins are required." });
      }

      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }

        const currentCoin = user.coin || 0;
        const newCoins = currentCoin + coins;

        // ✅ Prevent Negative Balance
        if (coins < 0 && currentCoin < Math.abs(coins)) {
          return res.status(400).send({ message: "❌ Not enough coins." });
        }

        // ✅ Update Coins
        const result = await usersCollection.updateOne(
          { email },
          { $set: { coin: newCoins } }
        );

        if (result.modifiedCount > 0) {
          return res.send({ message: "✅ Coins updated.", coin: newCoins });
        } else {
          return res
            .status(500)
            .send({ message: "❌ Failed to update coins." });
        }
      } catch (error) {
        console.error("Coin update error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { amount, email, coins } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          metadata: { email, coins },
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Payment Intent creation failed" });
      }
    });
    // POST: /submissions
    app.post("/submissions", async (req, res) => {
      const submission = req.body;
      const result = await submissionsCollection.insertOne(submission);
      res.send(result);
    });

    // PATCH /submissions/approve
    app.patch("/submissions/approve", async (req, res) => {
      try {
        const { submissionId, workerEmail, amount } = req.body;

        const submissionObjectId = new ObjectId(submissionId);

        // 1. Update submission status to "approved"
        const updateSubmission = await submissionsCollection.updateOne(
          { _id: submissionObjectId },
          { $set: { status: "approved" } }
        );

        // 2. Add coins to the user
        const updateUser = await usersCollection.updateOne(
          { email: workerEmail },
          { $inc: { coin: parseInt(amount) } }
        );

        res.send({
          success: true,
          message: "Submission approved and coin added.",
          updateSubmission,
          updateUser,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Server Error" });
      }
    });
    // DELETE Task API
    app.delete("/tasks/:id", async (req, res) => {
      const taskId = req.params.id;

      try {
        const task = await tasksCollection.findOne({
          _id: new ObjectId(taskId),
        });

        if (!task) {
          return res
            .status(404)
            .send({ success: false, message: "Task not found" });
        }

        // 1. Remove the task
        const deleteResult = await tasksCollection.deleteOne({
          _id: new ObjectId(taskId),
        });

        // 2. Calculate coins to refund
        const refundAmount = task.required_workers * task.payable_amount;

        // 3. Refund the coins to the buyer
        await usersCollection.updateOne(
          { email: task.creator_email },
          { $inc: { coin: refundAmount } }
        );

        res.send({
          success: true,
          message: "Task deleted & coins refunded",
          refundAmount,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    app.get("/admin/stats", async (req, res) => {
      try {
        const totalWorkers = await usersCollection.countDocuments({
          role: "worker",
        });
        const totalBuyers = await usersCollection.countDocuments({
          role: "buyer",
        });

        const users = await usersCollection.find().toArray();
        const totalCoins = users.reduce(
          (sum, user) => sum + (user.coin || 0),
          0
        );

        const payments = await paymentsCollection.find().toArray();
        const totalPayments = payments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );

        res.send({ totalWorkers, totalBuyers, totalCoins, totalPayments });
      } catch (error) {
        console.error("Admin stats fetch failed", error);
        res.status(500).json({ message: "Failed to fetch stats" });
      }
    });
    app.get("/admin/withdraw-requests", async (req, res) => {
      try {
        const requests = await withdrawalsCollection
          .find({ status: "pending" })
          .sort({ withdraw_date: -1 })
          .toArray();

        res.send(requests);
      } catch (error) {
        console.error("Failed to get withdraw requests:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    app.patch("/admin/withdraw-requests/:id/approve", async (req, res) => {
      const { id } = req.params;
      const { email } = req.body;

      try {
        // Step 1: Approve the withdrawal request
        const withdrawal = await withdrawalsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!withdrawal)
          return res
            .status(404)
            .send({ message: "Withdrawal request not found." });

        const updateStatus = await withdrawalsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "approved" } }
        );

        // Step 2: Decrease user's coins
        const user = await usersCollection.findOne({ email });

        if (!user) return res.status(404).send({ message: "User not found." });

        const newCoinBalance = (user.coin || 0) - withdrawal.withdrawal_coin;

        if (newCoinBalance < 0) {
          return res
            .status(400)
            .send({ message: "Insufficient coins in user account." });
        }

        await usersCollection.updateOne(
          { email },
          { $set: { coin: newCoinBalance } }
        );

        res.send({ message: "Withdrawal approved and coins updated." });
      } catch (error) {
        console.error("Failed to approve withdrawal:", error);
        res.status(500).send({ message: "Server error" });
      }
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount > 0) {
          res.send({ message: "User deleted successfully" });
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });
    app.patch("/users/:id/role", async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;

      if (!role) {
        return res.status(400).send({ message: "Role is required" });
      }

      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } }
        );

        if (result.modifiedCount > 0) {
          res.send({ message: "Role updated successfully" });
        } else {
          res.status(404).send({ message: "No update performed" });
        }
      } catch (error) {
        console.error("Role update error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.post("/payments", async (req, res) => {
      try {
        const payment = req.body;

        // Basic validation
        if (!payment.email || !payment.amount || !payment.coins) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        payment.date = new Date(); // Add date field
        const result = await paymentsCollection.insertOne(payment);

        res.status(201).send({
          message: "Payment saved successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error saving payment:", error);
        res.status(500).send({ error: "Failed to save payment" });
      }
    });
    // ✅ Get submissions for a worker or buyer with pagination
    app.get("/submissions", async (req, res) => {
      try {
        const {
          worker_email,
          buyer_email,
          status,
          page = 1,
          limit = 5,
        } = req.query;

        if (!worker_email && !buyer_email) {
          return res
            .status(400)
            .json({ message: "worker_email or buyer_email is required" });
        }

        const query = {};
        if (worker_email) query.worker_email = worker_email;
        if (buyer_email) query.buyer_email = buyer_email;

        if (status) {
          query.status = status;
        }
        if (status && status !== "pending") {
          query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const submissions = await submissionsCollection
          .find(query)
          .sort({ current_date: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        const total = await submissionsCollection.countDocuments(query);

        res.status(200).json({ submissions, total });
      } catch (error) {
        console.error("Failed to get submissions:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.patch("/buyer/submissions/:id/approve", async (req, res) => {
      const { id } = req.params;

      try {
        const submission = await submissionsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!submission) {
          return res
            .status(404)
            .json({ message: "Submission খুঁজে পাওয়া যায়নি" });
        }

        if (submission.status !== "pending") {
          return res
            .status(400)
            .json({ message: "Submission আগেই Approve/Reject হয়েছে" });
        }

        const workerEmail = submission.worker_email;
        const coinsToAdd = Number(submission.payable_amount);
        const taskId = submission.task_id;

        // ✅ 1. কয়েন বাড়ানো হচ্ছে
        const worker = await usersCollection.findOne({ email: workerEmail });
        const updatedCoin = (worker.coin || 0) + coinsToAdd;

        await usersCollection.updateOne(
          { email: workerEmail },
          { $set: { coin: updatedCoin } }
        );

        // ✅ 2. সাবমিশন done করা হচ্ছে
        await submissionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "approved" } }
        );

        // ✅ 3. Task এর required_workers কমানো হচ্ছে
        const task = await tasksCollection.findOne({
          _id: new ObjectId(taskId),
        });
        console.log(task);
        const updatedWorkers = (task.required_workers || 1) - 1;

        await tasksCollection.updateOne(
          { _id: new ObjectId(taskId) },
          {
            $set: {
              required_workers: updatedWorkers,
              status: updatedWorkers <= 0 ? "complete" : task.status,
            },
          }
        );

        res.status(200).json({
          message:
            "Submission Approve হয়েছে, worker কয়েন পেয়েছে এবং task worker count কমানো হয়েছে।",
        });
      } catch (error) {
        console.error("Buyer approval error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.patch("/buyer/submissions/:id/reject", async (req, res) => {
      const { id } = req.params;

      try {
        const submission = await submissionsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!submission) {
          return res
            .status(404)
            .json({ message: "Submission no found" });
        }

        if (submission.status !== "pending") {
          return res
            .status(400)
            .json({ message: "Submission  Approve/Reject " });
        }

        
        await submissionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } }
        );

        res.status(200).json({ message: "Submission reject করা হয়েছে" });
      } catch (error) {
        console.error("Buyer reject error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/payments", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send({ error: "Email is required" });
        }

        const payments = await paymentsCollection
          .find({ email })
          .sort({ date: -1 })
          .toArray();

        res.send(payments);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        res.status(500).send({ error: "Failed to load history" });
      }
    });
    app.get("/tasks/:id", async (req, res) => {
      const taskId = req.params.id;
      const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.send({ message: "Task deleted successfully" });
        } else {
          res.status(404).send({ message: "Task not found" });
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    app.patch("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTask = req.body;

        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );

        if (result.modifiedCount > 0) {
          res.send({ message: "Task updated successfully" });
        } else {
          res.status(404).send({ message: "No task updated" });
        }
      } catch (error) {
        console.error("Failed to update task:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    app.get("/forbidden-tasks", async (req, res) => {
      try {
        const email = req.query.creator_email;
        const query = { creator_email: email, status: "forbidden" };
        const result = await tasksCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Failed to get forbidden tasks:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // POST: /notifications
    app.post("/notifications", async (req, res) => {
      try {
        const {
          worker_email, // যাকে notification যাবে (receiver email)
          toEmail, // যদি আলাদা ব্যবহার করতে চান, না হলে worker_email এর জায়গায় ব্যবহার করবেন
          message,
          coin,
          title,
          buyerName,

          type = "task_approved",
          buyer_email,
          date = new Date(),
          actionRoute, // নতুন ফিল্ড যুক্ত হলো
        } = req.body;

        // যদি toEmail থাকে, সেটাকে worker_email এ assign করতে পারেন (optional)
        const receiverEmail = worker_email || toEmail;

        if (!receiverEmail || !message) {
          return res.status(400).json({ message: "Required fields missing" });
        }

        const notification = {
          worker_email: receiverEmail, // যাকে notification যাবে
          message,
          coin,
          type,
          title,
          buyerName,
          buyer_email,
          date,
          actionRoute, // এই ফিল্ড যোগ করলেন
          read: false,
        };

        const result = await notificationsCollection.insertOne(notification);
        res.status(201).json({ success: true, result });
      } catch (err) {
        console.error("Failed to post notification", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET: /notifications?email=user@example.com
    app.get("/notifications", async (req, res) => {
      const { worker_email } = req.query;

      if (!worker_email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const notifications = await notificationsCollection
        .find({ worker_email }) // এখানে worker_email এর ভিত্তিতে filter
        .sort({ date: -1 })
        .toArray();

      res.json(notifications);
    });

    // ✅ Get user coin

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
