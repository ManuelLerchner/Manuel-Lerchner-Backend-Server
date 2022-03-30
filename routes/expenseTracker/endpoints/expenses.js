const express = require("express");
const router = express.Router();

const {
    checkIfAuthenticatedWithToken,
    performDatabaseAction,
} = require("../helper");

router.get("/", (req, res) => {
    performDatabaseAction(res, async (conn) => {
        //Authentication
        let queryResponse = await checkIfAuthenticatedWithToken(
            req.query.email,
            req.query.authToken,
            conn,
            res
        );

        if (!queryResponse) {
            return;
        }

        //Perform query
        let expenses = await conn.query(
            "SELECT * FROM expenses WHERE user_id = ?",
            [queryResponse.id]
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
        let queryResponse = await checkIfAuthenticatedWithToken(
            req.body.email,
            req.body.authToken,
            conn,
            res
        );

        if (!queryResponse) {
            return;
        }

        //Perform query
        let expenseToUpdate = req.body.expenseToUpdate;
        await conn.query(
            "UPDATE expenses SET user_id=?, amount = ?,description = ?, categories = ?, date=? WHERE id = ?",
            [
                queryResponse.id,
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

module.exports = router;
