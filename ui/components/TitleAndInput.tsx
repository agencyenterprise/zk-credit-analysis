import TextInput from "./TextInput"

interface ITitleAndInput {
  title: string,
  description?: string
  value: number | string
  setValue: Function
  placeholder: string
  onlyNumber?: boolean
  allowSpecialCharacters?: boolean
  suffix?: string
  prefix?: string
}

function TitleAndInput({ title, description, value, setValue, placeholder, onlyNumber = false, allowSpecialCharacters = true, suffix, prefix }: ITitleAndInput) {

  return (
    <div>
      <div className="font-medium text-base text-gray-100 h-8">{title}</div>
      <TextInput
        value={value} 
        setValue={setValue}
        placeholder="0"
        onlyNumber={onlyNumber}
        suffix={suffix}
        prefix={prefix}
      />
    </div>
  )
}

export default TitleAndInput