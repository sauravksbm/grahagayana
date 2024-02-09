import React, { useEffect } from 'react';
import { Alert, BackHandler, Text, ToastAndroid, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../config/context';
import { colors } from '../config/Constants';
import { getData, storeData } from '../utils/storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import NoteCard from './NoteCard';

const Notes = ({ selectedNotes, setSelectedNotes, filteredNotes, isSearchMode, setIsSearchMode }) => {
  const { notes, setNotes } = useGlobalContext();
  const navigation = useNavigation();
  const isFocussed = useIsFocused();

  useEffect(() => {
    const backAction = () => {
      if (!isFocussed) return;
      if (selectedNotes.length > 0) {
        setSelectedNotes([]);
        return true;
      }
      if (isSearchMode) {
        setIsSearchMode(false);
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [isFocussed, selectedNotes, setSelectedNotes, isSearchMode, setIsSearchMode]);

  const handlePress = (id) => {
    if (selectedNotes.length === 0) {
      navigation.navigate("UpdateNote", { id });
    } else {
      setSelectedNotes((prevSelectedNotes) =>
        prevSelectedNotes.includes(id)
          ? prevSelectedNotes.filter((selectedNoteId) => selectedNoteId !== id)
          : [...prevSelectedNotes, id]
      );
    }
  };

  const handleLongPress = (id) => {
    if (!selectedNotes.includes(id)) {
      setSelectedNotes([...selectedNotes, id]);
    }
  };

  const moveNoteToTrash = async (noteId) => {
    try {
      const note = notes.find((note) => note.id === noteId);
      const trashNotes = (await getData("trashNotes")) || [];
      const newTrashNotesArr = [...trashNotes, note];
      await storeData("trashNotes", newTrashNotesArr);

      const newNotesArr = notes.filter((note) => note.id !== noteId);
      await storeData("notes", newNotesArr);
      setNotes(newNotesArr);
      setSelectedNotes([]);
      ToastAndroid.show("Note moved to trash", ToastAndroid.SHORT);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error occurred!!");
    }
  };

  const changeOrderOfNotes = async ({ data }) => {
    try {
      const newNotesArr = data;
      if (newNotesArr.length === notes.length && JSON.stringify(newNotesArr) === JSON.stringify(notes)) return;
      setNotes(newNotesArr);
      await storeData("notes", newNotesArr);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error occurred!!");
    }
  };

  const getDraggableFlatList = (notes) => {
    const notesCopy = [...notes.filter((note) => note.isPinned), ...notes.filter((note) => !note.isPinned)];
  
    return (
      <DraggableFlatList
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 5, paddingBottom: 60 }}
        data={notesCopy}
        keyExtractor={(note) => note.id}
        renderItem={({ item: note, drag, isActive }) => (
          <NoteCard
            {...{
              note,
              isActive,
              moveNoteToTrash,
              onPress: () => handlePress(note.id),
              onLongPress: () => {
                handleLongPress(note.id);
                drag();
              },
            }}
            isAddedInSelection={selectedNotes.includes(note.id)}
          />
        )}
        onDragEnd={changeOrderOfNotes}
        autoscrollThreshold={100}
      />
    );
  };
  

  const renderNoteList = (noteList, noteCountText) => (
    <>
      <Text style={{ color: colors.background_theme2, fontWeight: "600", fontSize: 15, paddingHorizontal: 10, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#efefef" }}>
        {noteCountText}
      </Text>
      {getDraggableFlatList(noteList)}
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      {notes.length === 0 && (
        <View style={{ marginTop: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16 }}>No notes. Tap + icon to add a new note.</Text>
        </View>
      )}
      {notes.length > 0 && (
        <>
          {!isSearchMode ? (
            renderNoteList(notes, `${notes.length} note${notes.length > 1 ? 's' : ''}`)
          ) : (
            filteredNotes === null ? (
              renderNoteList(notes, `${notes.length} note${notes.length > 1 ? 's' : ''}`)
            ) : filteredNotes.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18, color: "#888" }}>No notes found.</Text>
            ) : (
              renderNoteList(filteredNotes, `${filteredNotes.length} note${filteredNotes.length > 1 ? 's' : ''} found`)
            )
          )}
        </>
      )}
    </View>
  );
};

export default Notes;
