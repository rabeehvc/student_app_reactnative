import React from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const { width } = Dimensions.get('window');
const Loader = ({
  row = 1,
  column,
  padding = 3,
  borderRadius = 4,
  ...props
}) => {
  const list = [];

  let height;

  for (let j = 0; j < column; j++) {
    const itemWidth = (width - padding * (column + 1)) / column;
    const x = padding + j * (itemWidth + padding + 10);
    const height1 = 90;
    const height2 = 17;
    const height3 = 17;
    const y1 = padding + padding * 2 + 7;
    const y2 = y1 + padding + height1 + 7;
    const y3 = y2 + padding / 2 + height2 + 7;

    list.push(
      <React.Fragment key={j}>
        <Rect
          x={x}
          y={y1}
          rx={borderRadius}
          ry={borderRadius}
          width={itemWidth}
          height={height1}
        />
        <Rect x={x} y={y2} rx={0} ry={0} width={itemWidth} height={height2} />
        <Rect x={x} y={y3} rx={0} ry={0} width={itemWidth} height={height3} />
      </React.Fragment>
    );

    height = y3 + height3;
  }

  return (
    <ContentLoader
      viewBox={`0 0 ${width} ${height}`}
      // width={width}
      width='100%'
      height={height}
      {...props}
    >
      {list}
    </ContentLoader>
  );
};

export default Loader;
