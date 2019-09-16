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
  expanded: boolean
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

  const { property, expanded, rootProperty, propertyName } = props

  const expand = property instanceof Array && property.length <= 5

  return (
    <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
      {property ? (
        typeof property === 'number' ||
        typeof property === 'string' ||
        typeof property === 'boolean' ? (
          <React.Fragment>
            <PropertyName>{camelCaseToNormal(propertyName)}: </PropertyName>
            <PropertyValue>{property.toString()}</PropertyValue>
          </React.Fragment>
        ) : (
          <ExpandableJSONProperty 
            title={camelCaseToNormal(propertyName)} 
            expanded={rootProperty || expand || expanded}
          >
            {Object.values(property).map((innerProperty, index, { length }) => (
              <RecursiveJSONProperty
                key={index}
                property={innerProperty}
                propertyName={Object.getOwnPropertyNames(property)[index]}
                excludeBottomBorder={true} //index === length - 1
                expanded={expand}
              />
            ))}
          </ExpandableJSONProperty>
        )
      ) : property === 0 ? 
      (
        <React.Fragment>
          <PropertyName>{camelCaseToNormal(propertyName)}: </PropertyName>
          <PropertyValue>{property.toString()}</PropertyValue>
        </React.Fragment>
      ) : (
        'Empty Object'
      )}
    </RecursivePropertyContainer>
  );
};

// const camelCaseToNormal = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, str2 => str2.toUpperCase());
const camelCaseToNormal = (str: string) => str;

export default RecursiveJSONProperty

