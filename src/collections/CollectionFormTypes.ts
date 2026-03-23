import { Translatable } from "../components/hooks/useTranslationHandler";

export interface CollectionFormData extends Translatable
{
   collectionId:    string;
   boxId:           string;
   eng?: {
      title:       string;
      description: string;
   };
   bc?: {
      title:       string;
      description: string;
   };
   ak?: {
      title:       string;
      description: string;
   };
}

export interface CollectionFormBodyProps {
   formData:    CollectionFormData;
   setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
   isEditing:   boolean;
}