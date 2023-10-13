import { Button, Heading, TextAreaField, View } from "@aws-amplify/ui-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  CreateNoteInput,
  CreateNoteMutation,
  DeleteNoteInput,
  DeleteNoteMutation,
  ListNotesQuery,
  Note,
  UpdateNoteInput,
  UpdateNoteMutation,
} from "@/API";
import { API } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";
import { createNote, updateNote, deleteNote } from "@/graphql/mutations";
import { listNotes } from "@/graphql/queries";
import OneNote from "@/components/OneNote";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    grabAllNotes();
  }, []);

  const grabAllNotes = async () => {
    const allNotes = await API.graphql<GraphQLQuery<ListNotesQuery>>({
      query: listNotes,
    });
    console.log("allNotes", allNotes);
    setNotes(allNotes.data?.listNotes?.items as Note[]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const note = event.currentTarget.note.value;
    if (!note) return;

    const noteDetails: CreateNoteInput = {
      completed: false,
      name: note,
    };

    await API.graphql<GraphQLQuery<CreateNoteMutation>>({
      query: createNote,
      variables: { input: noteDetails },
    });

    setNote("");
    grabAllNotes();
  };

  const setUpdateNote = async (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const completed = event.target.checked;

    const noteDetails: UpdateNoteInput = {
      id,
      completed,
    };

    setNotes((prevNote) =>
      prevNote.map((note) =>
        note.id === id ? { ...note, completed: completed } : note
      )
    );

    await API.graphql<GraphQLQuery<UpdateNoteMutation>>({
      query: updateNote,
      variables: { input: noteDetails },
    });
  };
  const setDeleteNote = async (id: string) => {
    const noteDetails: DeleteNoteInput = {
      id,
    };

    await API.graphql<GraphQLQuery<DeleteNoteMutation>>({
      query: deleteNote,
      variables: { input: noteDetails },
    });
    grabAllNotes();
  };

  const summarizeText = async () => {
    if (!note) return;
    const summarizeIt = /* GraphQL */ `
      query NoteSummary($msg: String) {
        noteSummary(msg: $msg)
      }
    `;

    const data = await API.graphql<GraphQLQuery<{ noteSummary: string }>>({
      query: summarizeIt,
      variables: {
        msg: { note },
      },
    });
    console.log("data", data);
    setNote(data.data?.noteSummary ?? "");
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };
  return (
    <main className="p-4 flex justify-center items-center flex-col max-w-md m-auto gap-4">
      <Heading level={1}>Note Taker</Heading>
      <View
        as="form"
        onSubmit={handleSubmit}
        className="gap-4 flex flex-col w-full"
      >
        <TextAreaField
          label="note"
          onChange={onChange}
          value={note}
          labelHidden={true}
          className="w-full border p-2 mb-4"
          name="note"
          required
          id="note"
          placeholder="add note"
        ></TextAreaField>
        <Button type="button" onClick={summarizeText}>
          Summarize Using Bedrock
        </Button>
        <Button type="submit" variation="primary">
          Add Note
        </Button>
      </View>
      <View as="ul" className="flex flex-col space-y-2 text-gray-800 w-full">
        {notes.length > 0 &&
          notes.map((note) => (
            <OneNote
              key={note.id}
              note={note}
              updateNote={setUpdateNote}
              deleteNote={setDeleteNote}
            />
          ))}
      </View>
    </main>
  );
}
