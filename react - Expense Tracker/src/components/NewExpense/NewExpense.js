import { useState } from "react";

import "./NewExpense.css";
import ExpenseForm from "./ExpenseForm";

const NewExpense = (props) => {
    const [addNewButton, setAddNewButton] = useState(false);

    const onAddExpenseHandler = (expense) => {
        const newExpense = {
            ...expense,
            id: Math.random().toString(),
        };
        setAddNewButton(false);
        props.onAddExpenseForm(newExpense);
    };

    const onAddNewButtonHandler = () => {
        setAddNewButton(true);
    };

    const cancelButtonHandler = () => {
        setAddNewButton(false);
    };

    return (
        <div className="new-expense">
            {!addNewButton && (
                <button onClick={onAddNewButtonHandler}>Add New Expense</button>
            )}
            {addNewButton && (
                <ExpenseForm
                    onCancelButton={cancelButtonHandler}
                    onAddExpense={onAddExpenseHandler}
                />
            )}
        </div>
    );
};

export default NewExpense;
