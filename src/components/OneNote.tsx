import { Note } from "@/API";
import { View, Flex, CheckboxField, Button } from "@aws-amplify/ui-react";
import { ChangeEvent } from "react";

export default function OneNote({
  note,
  updateNote,
  deleteNote,
}: {
  note: Note;
  updateNote: (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}) {
  return (
    <View key={note.id} as="li" className="flex flex-col border p-4">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <CheckboxField
            labelHidden={true}
            label="completed"
            onChange={(e) => updateNote(e, note.id)}
            checked={note.completed}
            name="completed"
          />
          {note.name}
        </Flex>
        <View>
          <Button onClick={() => deleteNote(note.id)} variation="destructive">
            X
          </Button>
        </View>
      </Flex>
    </View>
  );
}
