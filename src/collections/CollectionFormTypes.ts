import {Translatable} from "../components/hooks/useTranslationHandler";

export interface CollectionFormData extends Translatable
{
   collectionId:    string;
   boxId:           string;
   eng_title:       string;
   eng_description: string;
   bc_title:        string;
   bc_description:  string;
   ak_title:        string;
   ak_description:  string;
}

export interface CollectionFormBodyProps {
   formData:    CollectionFormData;
   setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
   isEditing:   boolean;
}