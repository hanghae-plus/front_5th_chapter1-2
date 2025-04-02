/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  rows?: number;
}

export const FormField = ({
  label,
  id,
  type = "text",
  value,
  rows = undefined,
}: FormFieldProps) => (
  <div className="mb-4">
    <label for={id} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    {rows ? (
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="w-full p-2 border rounded"
      >
        {value}
      </textarea>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        className="w-full p-2 border rounded"
        value={value}
        required
      />
    )}
  </div>
);
