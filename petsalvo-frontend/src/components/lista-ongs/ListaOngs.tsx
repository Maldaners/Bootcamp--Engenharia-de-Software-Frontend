import CardOng from "@/components/lista-ongs/CardOng";
import React from "react";
import Ong from "@/model/Ong";

interface CardListProps {
    ongDataList: Ong[], 
 }

const ListaOngs = (props: CardListProps) => {
    const {ongDataList} = props;

    return <div className="flex flex-col gap-5 lg:max-h-[37.75rem] overflow-auto">
        {ongDataList.map(ongData => <CardOng key={ongData.id} ongData={ongData} />)}
    </div>
}

export default ListaOngs