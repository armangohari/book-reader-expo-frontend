import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/axiosBase";
import {
  capitalizePhrase,
  hyphenizePhrase,
  showToast,
  timestampPhrase,
} from "@/utils/helpers";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type BookUploadFormType = {
  uuid: string;
  title: string;
  description: string;
  uploadedBy: string;
  pdf: any | null;
};

export default function Add() {
  const authContext = useAuth();
  const router = useRouter();

  const [formState, setFormState] = useState<BookUploadFormType>({
    uuid: "",
    title: "",
    description: "",
    uploadedBy: "",
    pdf: null,
  });
  const [loading, setLoading] = useState(false);

  const pickPdf = async () => {
    let result: DocumentPicker.DocumentPickerResult =
      await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormState({ ...formState, pdf: result.assets[0] });
    }
  };

  const handleAddBook = async () => {
    const { title, description, pdf } = formState;

    if (!title || !description || !pdf) {
      showToast("All fields are required!");
      return;
    }

    const formData = new FormData();
    const uuid = timestampPhrase(hyphenizePhrase(capitalizePhrase(title)));
    formData.append("uuid", uuid);
    formData.append("title", capitalizePhrase(title));
    formData.append("description", description);
    formData.append("uploadedBy", authContext.authState.username as string);
    formData.append("pdf", {
      name: `${uuid}.pdf`,
      uri: pdf?.uri,
      type: pdf?.mimeType,
    } as any);

    setLoading(true);

    await axiosBase
      .post("/books/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res?.status === 201) {
          setFormState({
            uuid: "",
            title: "",
            description: "",
            uploadedBy: "",
            pdf: null,
          });
          router.replace("/(tabs)/");
          showToast("Book added successfully!");
        }
      })
      .catch((err) => {
        console.log(err); // ! delete
        showToast(err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View className="flex-1 gap-2 justify-start items-center mt-6">
      {/* Header */}
      <Text className="text-3xl font-bold mb-6">Add New Book</Text>

      {/* Title */}
      <View className="w-[80vw]">
        <Text className="mb-1 text-base font-light">Title</Text>
        <TextInput
          className="bg-white py-2 px-3 rounded-xl w-full focus:border-primary focus:border-2"
          value={formState.title}
          onChangeText={(text) => setFormState({ ...formState, title: text })}
        />
      </View>

      {/* Description */}
      <View className="w-[80vw]">
        <Text className="mb-1 text-base font-light">Description</Text>
        <TextInput
          className="bg-white py-2 px-3 rounded-xl w-full focus:border-primary focus:border-2"
          value={formState.description}
          onChangeText={(text) =>
            setFormState({ ...formState, description: text })
          }
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Upload PDF */}
      <View className="w-[80vw]">
        <Text className="mb-1 text-base font-light">PDF File</Text>
        <Pressable
          className="bg-primary/10 py-6 px-3 rounded-xl w-full"
          onPress={pickPdf}
        >
          <Text className="text-gray-600 font-bold text-base text-center">
            Upload
          </Text>
        </Pressable>
      </View>

      {formState.pdf && <Text className="mt-2 mb-4">{formState.pdf.name}</Text>}
      <Pressable
        className="w-[80vw] px-6 py-3 bg-primary rounded-xl min-w-[40vw]"
        onPress={handleAddBook}
        disabled={loading}
      >
        <Text className="text-white text-xl text-center">
          {loading ? "Adding..." : "Add Book"}
        </Text>
      </Pressable>
    </View>
  );
}
