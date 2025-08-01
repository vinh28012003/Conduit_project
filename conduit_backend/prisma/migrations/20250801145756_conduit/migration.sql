-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT,
    "username" VARCHAR(255) NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."article" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."article_tag_relation" (
    "id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,

    CONSTRAINT "article_tag_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favourite" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,

    CONSTRAINT "favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follow" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "article_slug_key" ON "public"."article"("slug");

-- CreateIndex
CREATE INDEX "article_author_id_idx" ON "public"."article"("author_id");

-- CreateIndex
CREATE INDEX "article_slug_idx" ON "public"."article"("slug");

-- CreateIndex
CREATE INDEX "article_createdAt_idx" ON "public"."article"("createdAt");

-- CreateIndex
CREATE INDEX "comment_author_id_idx" ON "public"."comment"("author_id");

-- CreateIndex
CREATE INDEX "comment_article_id_idx" ON "public"."comment"("article_id");

-- CreateIndex
CREATE INDEX "comment_createdAt_idx" ON "public"."comment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "public"."tag"("name");

-- CreateIndex
CREATE INDEX "article_tag_relation_tag_id_idx" ON "public"."article_tag_relation"("tag_id");

-- CreateIndex
CREATE INDEX "article_tag_relation_article_id_idx" ON "public"."article_tag_relation"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_tag_relation_tag_id_article_id_key" ON "public"."article_tag_relation"("tag_id", "article_id");

-- CreateIndex
CREATE INDEX "favourite_user_id_idx" ON "public"."favourite"("user_id");

-- CreateIndex
CREATE INDEX "favourite_article_id_idx" ON "public"."favourite"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "favourite_user_id_article_id_key" ON "public"."favourite"("user_id", "article_id");

-- CreateIndex
CREATE INDEX "follow_follower_id_idx" ON "public"."follow"("follower_id");

-- CreateIndex
CREATE INDEX "follow_following_id_idx" ON "public"."follow"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "follow_follower_id_following_id_key" ON "public"."follow"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "public"."article" ADD CONSTRAINT "article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_tag_relation" ADD CONSTRAINT "article_tag_relation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_tag_relation" ADD CONSTRAINT "article_tag_relation_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favourite" ADD CONSTRAINT "favourite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favourite" ADD CONSTRAINT "favourite_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
