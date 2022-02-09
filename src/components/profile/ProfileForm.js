//hooks
import { useState } from "react";
import { useDate } from "../../hooks/useDate";


const ProfileForm = () => {

    // ******** STATES AND OTHERS ********//

    const date = useDate()
    const [expense, setExpense] = useState(true)
    const [income, setIncome] = useState(false)
    const [formData, setFormData] = useState({
        expenseIncomeTitle: '',
        expenseIncomeAmount: '',
        expenseIncomeDate: ''
        //servertimestamp will replace expenseDate
    })
    const { expenseIncomeTitle, expenseIncomeAmount, expenseIncomeDate } = formData

    // ********* MAIN LOGIC *********//

    //submit expense/income form data
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    //save expense/income form data in state
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    //toggle between expense or income
    const handleExpenseButtonClick = () => {
        //add focus on input
        setExpense(true)
        setIncome(false)
    }

    const handleIncomeButtonClick = () => {
        //add focus on input
        setIncome(true)
        setExpense(false)
    }



    return (
        <form className="profileForm" onSubmit={handleSubmit}>
            <div className="buttonContainer">
                <div className={`btn ${ expense ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleExpenseButtonClick}>Expense</div>
                <div className={`btn ${ income ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleIncomeButtonClick}>Income</div>
            </div>
            <div className="expenseTitleDiv">
                <input
                    type="text"
                    id="expenseIncomeTitle"
                    placeholder={expense ? 'Expense Title' : 'Income Title'} required
                    minLength='3'
                    maxLength='15'
                    value={expenseIncomeTitle}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className="expenseIncomeAmountDiv">
                <input
                    type="number"
                    id="expenseIncomeAmount"
                    placeholder='Amount'
                    step=".01"
                    required
                    min='0'
                    max='999999999'
                    value={expenseIncomeAmount}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <input
                type="date"
                id="expenseIncomeDate"
                value={!expenseIncomeDate ? date : expenseIncomeDate}
                onChange={(e) => handleChange(e)}
                required
            />
            <button type='submit' className="btn addBtn">Add</button>
        </form>
    );
}

export default ProfileForm;