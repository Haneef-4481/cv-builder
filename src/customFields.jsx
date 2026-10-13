function RadioButtons({ buttons, type, callback }) {
  return (
    <div className="radios">
      {buttons.map((button) => {
        return (
          <div key={button}>
            <input
              type="radio"
              name={type}
              id={button}
              value={button}
              onChange={(e) => {
                callback(e.target.value != "yes");
              }}
            />
            <label htmlFor={button}>{button}</label>
          </div>
        );
      })}
    </div>
  );
}

export { RadioButtons };
