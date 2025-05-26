declare module 'react-native-flip-card-plus' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface FlipCardProps {
    style?: ViewStyle;
    friction?: number;
    perspective?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    flip?: boolean;
    clickable?: boolean;
    onFlipEnd?: () => void;
    children: [React.ReactNode, React.ReactNode];
  }

  export class FlipCard extends Component<FlipCardProps> {}
} 