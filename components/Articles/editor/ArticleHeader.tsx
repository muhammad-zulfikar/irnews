import type React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Tag, Globe, Plus, Trash } from 'lucide-react';
import { ArticleType } from '@/types/article';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ArticleHeaderProps {
  article: ArticleType['articles'][0];
  onUpdate: (updates: Partial<ArticleType['articles'][0]>) => void;
}

export function ArticleHeader({ article, onUpdate }: ArticleHeaderProps) {
  const coverImgInputRef = useRef<HTMLInputElement>(null);
  const coverImgAltRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const tags = ['Diplomacy', 'Conflicts', 'Economy', 'Climate'];
  const regions = ['Asia', 'Europe', 'Middle East', 'Africa', 'Americas'];

  const handlecoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ coverImg: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovecoverImg = () => {
    onUpdate({ coverImg: '', coverImgAlt: '' });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ coverImg: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handlecoverImgAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ coverImgAlt: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    onUpdate({ title: content });

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;

    const slug = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    onUpdate({ slug });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onUpdate({ description: e.target.value });

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ location: e.target.value });
  };

  const handleTagSelect = (tag: string) => {
    onUpdate({ tag: tag });
  };

  const handleRegionSelect = (region: string) => {
    onUpdate({ region: region });
  };

  return (
    <div className='mb-8'>
      <div className='space-y-6'>
        {/* Cover Image Section */}
        <div
          className={`relative w-full h-[400px] mb-4 ${article.coverImg ? 'mb-[5rem]' : ''}`}
        >
          <div
            className='relative w-full max-w-4xl h-[400px] mx-auto border-2 border-dashed border-gray-300 overflow-hidden'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {article.coverImg ? (
              <div
                onClick={() => coverImgInputRef.current?.click()}
                className='cursor-pointer w-full h-full'
              >
                <Image
                  src={article.coverImg || '/images/default-fallback-image.png'}
                  alt={article.coverImgAlt || 'Cover Image'}
                  width={1200}
                  height={300}
                  className='object-cover w-full h-full'
                />
                <Button
                  variant='destructive'
                  onClick={handleRemovecoverImg}
                  className='absolute bottom-4 right-4 p-2 flex items-center'
                >
                  <Trash className='w-5 h-5 mr-2' />
                  Remove
                </Button>
              </div>
            ) : (
              <label className='absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'>
                <input
                  ref={coverImgInputRef}
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handlecoverImgChange}
                />
                <div className='text-center p-4'>
                  <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                  <p className='text-sm text-gray-500'>
                    Drop a cover image here, or click to select
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Maximum size: 2MB
                  </p>
                </div>
              </label>
            )}
          </div>

          {article.coverImg && (
            <div className='text-center mt-2'>
              <input
                ref={coverImgAltRef}
                type='text'
                value={article.coverImgAlt}
                onChange={handlecoverImgAltChange}
                className='w-full p-2 focus:outline-none text-center border border-gray-300 focus:outline-none'
                placeholder='Enter alt text for the cover image'
              />
            </div>
          )}
        </div>

        {/* Labels Section */}
        <div className='flex flex-wrap gap-2 md:gap-4 my-6 ml-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Tag className='w-4 h-4' />
                {tags.includes(article.tag) ? article.tag : 'Select Tags'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Globe className='w-4 h-4' />
                {regions.includes(article.region)
                  ? article.region
                  : 'Select Region'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 p-2 shadow-lg'>
              <DropdownMenuGroup>
                {regions.map((region) => (
                  <DropdownMenuItem
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className='cursor-pointer flex items-center gap-2'
                  >
                    {region}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title Section */}
        <div className='relative'>
          <textarea
            ref={titleRef}
            value={article.title}
            onChange={handleTitleChange}
            className='w-full text-4xl md:text-5xl font-bold leading-tight focus:outline-none resize-none overflow-hidden bg-transparent'
            rows={1}
            placeholder='Untitled Article'
          />
        </div>

        {/* Description Section */}
        <div className='relative'>
          <textarea
            ref={descriptionRef}
            value={article.description}
            onChange={handleDescriptionChange}
            className='w-full text-md md:text-lg text-gray-600 leading-relaxed focus:outline-none resize-none overflow-hidden bg-transparent'
            rows={3}
            placeholder='Add a description...'
          />
        </div>
      </div>

      {/* Date and Location Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mt-6 pb-6 border-b border-black'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-5 h-5' />
            <input
              type='text'
              className='border-none focus:outline-none'
              value={article.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              placeholder='1 January 2025...'
            />
          </div>
          <div className='flex items-center gap-4 text-gray-600 relative whitespace-nowrap'>
            <MapPin className='w-5 h-5 flex-shrink-0' />
            <input
              ref={locationRef}
              type='text'
              value={article.location}
              onChange={handleLocationChange}
              className='focus:outline-none min-w-[100px] bg-transparent'
              placeholder='Jakarta, Indonesia...'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
