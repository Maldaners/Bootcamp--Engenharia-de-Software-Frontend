import React from "react";
import 'ol/ol.css'
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { Geolocation as OLGeoLoc } from "ol";
import Feature from 'ol/Feature'
import {Icon, Style} from 'ol/style.js';
import { fromLonLat } from 'ol/proj'
import Ong from "@/model/Ong";

import {
  RMap,
  ROSM,
  RPopup,
  RLayerVector,
  RFeature,
  RGeolocation,
  RStyle,
  useOL,
} from "rlayers";
import Endereco from "@/model/Endereco";
import { geocodingService } from "@/services/geocoding.service";

function GeolocComp(props: MapaOngsProps): JSX.Element {
  const {ongDataList} = props;
  const [pos, setPos] = React.useState(new Point(fromLonLat([-5189971.8533339435, -2716628.8631729186])));
  console.log("🚀 ~ GeolocComp ~ pos:", pos)
  const [coordinates, setCoordinates]= React.useState<any>({})
  const [features, setFeatures] = React.useState<any>([]);

  const [isLoading, setIsloading] = React.useState<boolean>(true);

  const { map } = useOL();

  const locationIcon = "https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/location.svg"
  const monument = 'https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/monument.svg';

  const getCoordinates = (index: number) => {
    const coords: Record<string, Coordinate> = coordinates;

    return coords[index]
  }
  
  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: monument,
    }),
  });
  
  const getFormatedAddress = (address: Endereco) =>{
    const string = `${address.rua} ${address.numero} ${address.cidade}`
    
    return string.replaceAll(' ', '%20')
  }

  const fetchCoordinates = async () => {
    if (!ongDataList.length) return;
  
    for (const ong of ongDataList) {
      try {
        const coordinate = await geocodingService.getCoordinates(getFormatedAddress(ong.endereco));

        setCoordinates((prevCoordinates: Array<number>) => ({
          ...prevCoordinates,
          [Object.keys(prevCoordinates).length]: coordinate,
        }));
        
      } catch (error) {
        console.error("Erro ao obter coordenadas:", error);
      }
    }

    setIsloading(false)
  };
  
  React.useEffect(() => {
    fetchCoordinates();
  }, [ongDataList]);

  React.useEffect(() => {
    if (isLoading) return

    setFeatures(ongDataList?.map(
      (ong, index) => { 
        const coordinate = getCoordinates(index);

        if (!coordinate) return;

        const newFeature = new Feature({
          geometry: new Point(fromLonLat(coordinate)),
          usuario: ong.usuario,
          endereco: ong.endereco,
          uid: index,
          style: iconStyle
        })
        newFeature.setStyle(iconStyle);

        return newFeature
        }
    ))
  }, [ongDataList, coordinates])

  const handleChangePosition = React.useCallback((e: any) => {
    const geoloc: any = e.target as OLGeoLoc;
    setPos(new Point(geoloc.getPosition()));
    map.getView().fit(geoloc.getAccuracyGeometry(), {
      duration: 250,
      maxZoom: 12,
    });
  },
  [map])

  if (typeof document !== 'undefined') {
    return (
      <>
        <RGeolocation
          tracking={true}
          trackingOptions={{ enableHighAccuracy: true }}
          onChange={handleChangePosition}
        />
        <RLayerVector zIndex={10}>
          <RStyle.RStyle>
            <RStyle.RIcon src={locationIcon} anchor={[0.5, 0.8]} />
          </RStyle.RStyle>
          <RFeature geometry={pos}></RFeature>
          {features.map((f, i) => {
            if (!f) return
            
            const properties = f.getProperties()
            
            return (
              <RFeature key={i} feature={f} >
                <RStyle.RStyle>
                  <RStyle.RIcon src={monument} anchor={[0.5, 0.8]} />
                </RStyle.RStyle>
                <RPopup trigger={"click"} className="example-overlay">
                  <div className="bg-white w-64 rounded-xl p-2">
                    <p className="text-wrap text-left mb-2">
                      <strong>{properties.usuario.nome}</strong>
                    </p>
                    <p className="text-wrap text-left mb-0">{`Telefone: ${properties.usuario.telefone}`}</p>
                    <p className="text-wrap text-left">{`${properties.endereco.rua}, ${properties.endereco.numero} - ${properties.endereco.cidade}`}</p>
                  </div>
                </RPopup>
              </RFeature>
            )
  })}
        </RLayerVector>
      </>
    );
  }

}

interface MapaOngsProps {
  ongDataList: Ong[], 
}

export default function MapaOngs(props: MapaOngsProps): JSX.Element {
  const {ongDataList} = props;

  if (typeof document !== 'undefined') {
    return (
      <div className="flex-1 w-[44rem] h-[41.1rem] bg-gray-300">
        <RMap
          className="w-full h-full"
          initial={{ center: fromLonLat([-5189971.8533339435, -2716628.8631729186]), zoom: 12 }}
        >
          <ROSM />
          <GeolocComp ongDataList={ongDataList} />
        </RMap>
      </div>
    );
  }

  else return <></>

}
