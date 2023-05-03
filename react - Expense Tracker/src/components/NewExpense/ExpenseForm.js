import { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
    // const [enteredTitle, setEnteredTitle] = useState("");
    // const [enteredِِAmount, setEnteredِِAmount] = useState("");
    // const [enteredDate, setEnteredDate] = useState("");

    const [userInput, setUserInput] = useState({
        enteredTitle: "",
        enteredAmount: 0,
        enteredDate: "",
    });

    const titleChangHandler = (event) => {
        // setEnteredTitle(event.target.value);

        // setUserInput({
        //     ...userInput,
        //     enteredTitle: event.target.value,
        // });

        //implement it this way well guarantee that it will be always the latest state snapshot
        //why? not the prev implementaion
        //because react schedule states so if there's a lot of state you might end up with outdated state
        setUserInput((prevState) => {
            return {
                ...prevState,
                enteredTitle: event.target.value,
            };
        });
    };
    const amountChangHandler = (event) => {
        setUserInput((prevState) => {
            return {
                ...prevState,
                enteredAmount: event.target.value,
            };
        });
    };
    const dateChangHandler = (event) => {
        setUserInput((prevState) => {
            return {
                ...prevState,
                enteredDate: event.target.value,
            };
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: userInput.enteredTitle,
            amount: +userInput.enteredAmount,
            date: new Date(userInput.enteredDate),
        };

        props.onAddExpense(expenseData);

        setUserInput((prevState) => {
            return {
                enteredTitle: "",
                enteredAmount: "",
                enteredDate: "",
            };
        });
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label>Title</label>
                    <input
                        type="text"
                        value={userInput.enteredTitle}
                        onChange={titleChangHandler}
                    />
                </div>
                <div className="new-expense__control">
                    <label>Amount</label>
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={userInput.enteredAmount}
                        onChange={amountChangHandler}
                    />
                </div>
                <div className="new-expense__control">
                    <label>Date</label>
                    <input
                        type="date"
                        min="01-01-2023"
                        max="31-12-2023"
                        value={userInput.enteredDate}
                        onChange={dateChangHandler}
                    />
                </div>
                <div className="new-expense__actions">
                    <button type="submit">Add Expense</button>
                </div>
                <div className="new-expense__actions">
                    <button type="button" onClick={props.onCancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ExpenseForm;
