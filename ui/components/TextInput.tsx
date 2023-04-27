interface ITextInput {
  value: number | string
  setValue: Function
  placeholder: string
  onlyNumber?: boolean
  allowSpecialCharacters?: boolean
  suffix?: string
  prefix?: string
}

function TextInput({ value, setValue, placeholder, onlyNumber = false, allowSpecialCharacters = true, suffix, prefix }: ITextInput) {
  const onChange = (value: any) => {
    let filteredString = onlyNumber ? value.replace(/[^0-9.]/g, '') : value
    filteredString = allowSpecialCharacters ? filteredString : value.replace(/[^a-zA-Z0-9]/g, '')
    setValue(filteredString)
  }

  return (
    <div>
      <div className="flex">
        {
          suffix || prefix ? (
            <label className="input-group">
              {prefix && <span className='text-white'>{prefix}</span>}
              <input
                type="text"
                placeholder={placeholder}
                className="input input-bordered w-full"
                onChange={(e) => onChange(e.target.value)}
                value={value}
              />
              {suffix && <span className='text-white'>{suffix}</span>}
            </label>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => onChange(e.target.value)}
              value={value}
            />
          )
        }
      </div>
    </div>
  )
}

export default TextInput