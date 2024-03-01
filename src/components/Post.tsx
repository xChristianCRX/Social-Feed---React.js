import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR"

import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import styles from "./Post.module.css";
import { FormEvent, useState, ChangeEvent, InvalidEvent } from "react";

interface Author{
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content{
  type: "paragraph" | "link";
  content: string;
}

export interface PostType{
  id: number;
  author: Author;
  content: Content[];
  publishedAt: Date;
}

interface PostProps{
  post:PostType;
}

export function Post({post}:PostProps) {

  const publishedDateFormmatted = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {locale: ptBR,});

  const publishedDateRelativeToNow =  formatDistanceToNow(post.publishedAt, {locale: ptBR, addSuffix:"true"})

  const [comments, setComments] = useState([
    "Post foda em",
  ])

  const [newCommentText, setNewCommentText] = useState("")

  const isNewCommentEmpty = newCommentText.length == 0;

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText("");
  }

  function handleNewCommentText(event: ChangeEvent<HTMLTextAreaElement>){
    event.target.setCustomValidity("")
    setNewCommentText(event.target.value);
  }

  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeletedOne = comments.filter(comment => {
      return comment!== commentToDelete;
    })
    setComments(commentsWithoutDeletedOne);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("Esse campo é obrigatório!")
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={post.author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{post.author.name}</strong>
            <span>{post.author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormmatted} dateTime={post.publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {post.content.map(line => {
          if(line.type == "paragraph"){
            return <p key={line.content}>{line.content}</p>
          }else if(line.type == "link"){
            return <p key={line.content}><a href="#">{line.content}</a></p>
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback!</strong>

        <textarea 
          placeholder="Deixe um comentário" 
          name="comment" 
          onChange={handleNewCommentText} 
          value={newCommentText}
          required
          onInvalid={handleNewCommentInvalid}
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment =>{
          return <Comment key={comment} content={comment} onDeleteComment={deleteComment}/>
        })}
      </div>
    </article>
  );
};