import "./ExpensesFilter.css";

import "./ExpensesFilter.css";

const ExpensesFilter = (props) => {
    const onSelectYearHandler = (event) => {
        const selectedDate = event.target.value;

        props.onSelectYear(selectedDate);
    };

    return (
        <div className="expenses-filter">
            <div className="expenses-filter__control">
                <label>Filter by year</label>
                <select value={props.selected} onChange={onSelectYearHandler}>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2023">2023</option>
                </select>
            </div>
        </div>
    );
};

export default ExpensesFilter;
