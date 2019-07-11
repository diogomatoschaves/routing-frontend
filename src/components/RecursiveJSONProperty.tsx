import * as React from 'react';
import styled from 'styled-components';
import ExpandableJSONProperty from './ExpandableJSONProperty';
import { PETROL_3 as COLOR, VALUE_COLOR } from '../utils/colours'

interface IterableObject {
  [s: string]: number | string | boolean | IterableObject;
}

interface Props {
  property: number | string | boolean | object | IterableObject;
  propertyName: string;
  rootProperty?: boolean;
  excludeBottomBorder: boolean;
}

const RecursivePropertyContainer = styled.div`
  padding-top: 10px;
  padding-left: 3px;
  margin-left: 10px;
  ${(props: { excludeBottomBorder: boolean }) =>
    props.excludeBottomBorder ? '' : 'border-bottom: 1px solid rgb(243, 243, 243);'}
  color: #666;    
  font-size: 16px;
  text-align: left;
`;

export const PropertyName = styled.span`
  color: ${COLOR};
  font-size: 14px;
  font-weight: bold;
`;

export const PropertyValue = styled.span`
  color: ${VALUE_COLOR};
  font-size: 14px;
  font-weight: bold;
`

const RecursiveJSONProperty: React.SFC<Props> = props => {
  return (
    <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
      {props.property ? (
        typeof props.property === 'number' ||
        typeof props.property === 'string' ||
        typeof props.property === 'boolean' ? (
          <React.Fragment>
            <PropertyName>{camelCaseToNormal(props.propertyName)}: </PropertyName>
            <PropertyValue>{props.property.toString()}</PropertyValue>
          </React.Fragment>
        ) : (
          <ExpandableJSONProperty title={camelCaseToNormal(props.propertyName)} expanded={!!props.rootProperty}>
            {Object.values(props.property).map((property, index, { length }) => (
              <RecursiveJSONProperty
                key={index}
                property={property}
                propertyName={Object.getOwnPropertyNames(props.property)[index]}
                excludeBottomBorder={index === length - 1} 
              />
            ))}
          </ExpandableJSONProperty>
        )
      ) : props.property === 0 ? 
      (
        <React.Fragment>
          <PropertyName>{camelCaseToNormal(props.propertyName)}: </PropertyName>
          <PropertyValue>{props.property.toString()}</PropertyValue>
        </React.Fragment>
      ) : (
        'Empty Object'
      )}
    </RecursivePropertyContainer>
  );
};

const camelCaseToNormal = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, str2 => str2.toUpperCase());

export default RecursiveJSONProperty

