import { useState } from "react";
import "./Expenses.css";
import Card from "./../UI/Card";
import ExpensesFilter from "./ExpensesFileter";
import ExpensesList from "./ExpensesList";
import ExpensesChart from "./ExpensesChart";

const Expenses = (props) => {
    const [enteredDate, setEnteredDate] = useState("2019");

    const onSelectYearHandler = (date) => {
        setEnteredDate(date);
    };

    const filterdExpenses = props.items.filter(
        (expense) => expense.date.getFullYear() === parseInt(enteredDate)
    );

    return (
        <Card className="expenses">
            <ExpensesFilter
                selected={enteredDate}
                onSelectYear={onSelectYearHandler}
            />
            <ExpensesChart expenses={filterdExpenses} />
            <ExpensesList items={filterdExpenses} />
        </Card>
    );
};

export default Expenses;
