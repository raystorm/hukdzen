import React from 'react';
import { useParams } from 'react-router-dom';


export default function Item()
{
   const { itemId } = useParams(); //Item ID

   return (
        <div>This is a Placeholder page for Displaying File details.</div>
   );
}