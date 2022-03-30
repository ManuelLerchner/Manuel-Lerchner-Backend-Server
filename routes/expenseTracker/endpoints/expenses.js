const express = require("express");
const router = express.Router();

const {
    checkIfAuthenticatedWithToken,
    performDatabaseAction,
} = require("../helper");

router.get("/", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        //Authentication
        let user = await checkIfAuthenticatedWithToken(
            req.query.email,
            req.query.authToken,
            conn,
            res
        );

        if (!user) {
            return;
        }

        //Perform query
        let expenses = await conn.query(
            "SELECT * FROM expenses WHERE user_id = ?",
            [user.id]
        );

        //Send response
        res.json(
            Array.from(expenses).map((expense) => {
                return {
                    id: expense.id,
                    description: expense.description,
                    amount: expense.amount,
                    date: expense.date,
                    categories: expense.categories,
                };
            })
        );
    });
});

router.put("/update", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        //Authentication
        let user = await checkIfAuthenticatedWithToken(
            req.body.email,
            req.body.authToken,
            conn,
            res
        );

        if (!user) {
            return;
        }

        //Perform query
        let expenseToUpdate = req.body.expenseToUpdate;
        await conn.query(
            "UPDATE expenses SET user_id=?, amount = ?,description = ?, categories = ?, date=? WHERE id = ?",
            [
                user.id,
                expenseToUpdate.amount,
                expenseToUpdate.description,
                expenseToUpdate.categories,
                expenseToUpdate.date,
                expenseToUpdate.id,
            ]
        );

        //Send response
        res.json(expenseToUpdate);
    });
});

router.post("/add", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        //Authentication
        let user = await checkIfAuthenticatedWithToken(
            req.body.email,
            req.body.authToken,
            conn,
            res
        );

        if (!user) {
            return;
        }

        console.log(req.body);

        //Perform query
        let expenseToAdd = req.body.expenseToAdd;
        await conn.query(
            "INSERT INTO expenses (user_id, amount,description, categories, date) VALUES (?, ?, ?, ?, ?)",
            [
                user.id,
                expenseToAdd.amount,
                expenseToAdd.description,
                expenseToAdd.categories,
                expenseToAdd.date,
            ]
        );

        //Send response
        res.json(expenseToAdd);
    });
});

router.delete("/delete", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        //Authentication
        let user = await checkIfAuthenticatedWithToken(
            req.query.email,
            req.query.authToken,
            conn,
            res
        );

        if (!user) {
            return;
        }

        //Perform query
        await conn.query("DELETE FROM expenses WHERE id = ?", [
            req.query.idToDelete,
        ]);

        //Send response
        res.json({
            id: req.query.idToDelete,
        });
    });
});

module.exports = router;
