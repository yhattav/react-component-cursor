export interface Section {
  id: string;
  title: string;
  component: React.FC<{ onDebugData?: (data: any) => void }>;
  height: string;
}
