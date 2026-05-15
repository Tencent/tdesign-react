import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';

const Typography: {
  Text: typeof Text;
  Title: typeof Title;
  Paragraph: typeof Paragraph;
} = () => null;

Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;

Text.displayName = 'Text';
Paragraph.displayName = 'Paragraph';
Title.displayName = 'Title';

export default Typography;
