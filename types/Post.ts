export default interface IPost extends PostDoc {
  email: string;
  photoURL: string;
  username: string;
  name: string;
}

export interface PostDoc {
  id: string;
  authorId: string;
  imageUrl: string;
  caption: string;
  likes: string[];
}
