
import { MessageSquare } from 'lucide-react';

export default function NotesSection({ notes, handleChange }) {
  return (
    <div className="mt-4">
      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
        <MessageSquare className="h-4 w-4 text-gray-500" /> Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        value={notes}
        onChange={handleChange}
        rows={3}
        placeholder="Add any additional information or client requirements..."
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}