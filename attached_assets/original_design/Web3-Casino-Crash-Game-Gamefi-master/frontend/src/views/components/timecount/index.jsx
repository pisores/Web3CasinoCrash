import { useCountdown } from "hooks/useCountdown";

const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
        <div className={isDanger ? 'countdown danger' : 'countdown'}>
            <div>{value}</div>
            <span>{type}</span>
        </div>
    );
};

const ExpiredNotice = () => {
    return (
        <div className="expired-notice">
            <span>Expired!!!</span>
            <p>Please select a future date and time.</p>
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter">
            <div
                className="countdown-link"
            >
                <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
                <p className='double-dot'>:</p>
                <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
                <p className='double-dot'>:</p>
                <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
                <p className='double-dot'>:</p>
                <DateTimeDisplay value={seconds} type={'Sec'} isDanger={false} />
            </div>
        </div>
    );
};

const TimeCount = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice />;
    } else {
        return (
            <ShowCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
}

export default TimeCount;