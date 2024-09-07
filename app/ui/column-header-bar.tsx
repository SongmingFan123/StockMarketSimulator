interface ColumnHeaderBarProps {
    fields: string[]
}
export default function ColumnHeaderBar({fields} : ColumnHeaderBarProps) {
  return (
      <div className="flex justify-around p-2 max-w-full sticky top-0 bg-indigo-500 text-white rounded-lg m-2">
        {fields.map((item)=>{return <p className="ml-9 flex-1" key={item}>{item}</p>})}
    </div>
  );
}
