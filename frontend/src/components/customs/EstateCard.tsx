import React, { useRef } from 'react';
// next
import Link from 'next/link';
// @mui
import { Stack } from '@mui/system';
import { useTheme, styled } from '@mui/material/styles';
import { Box, CardContent, Typography } from '@mui/material';
// assets
import img from 'src/assets/images/img.png';
import BedIcon from 'src/assets/icons/BedIcon';
import CarIcon from 'src/assets/icons/CarIcon';
import BathIcon from 'src/assets/icons/BathIcon';
import BellIcon from 'src/assets/icons/BellIcon';
import HeartIcon from 'src/assets/icons/HeartIcon';
import SquareIcon from 'src/assets/icons/SquareIcon';
import LocationIcon from 'src/assets/icons/LocationIcon';
// @type
import { IProduct } from 'src/@types/product';
// routes
import { PATH_PAGE } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, CarouselArrows } from 'src/components/carousel';
//
import RoundButton from './RoundButton';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundBlendMode: 'overlay',
  backgroundImage: 'linear-gradient(to bottom, #00000000, #00000099)',
}));
interface EstateCardProps {
  height?: number;
  product: IProduct;
}

type ItemProps = {
  id: string;
  name: string;
  image: string;
};

export default function EstateCard({ height, product }: EstateCardProps) {
  const theme = useTheme();
  const { t } = useLocales();
  const carouselRef = useRef<Carousel | null>(null);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    carouselRef.current?.slickPrev();
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    carouselRef.current?.slickNext();
  };

  const list = product.images && product.images.length > 0 
    ? product.images
        .filter((imageUrl: string) => {
          // Filtrar URLs válidas (não blob: e não vazias)
          return imageUrl && 
                 typeof imageUrl === 'string' && 
                 imageUrl.trim() !== '' &&
                 !imageUrl.startsWith('blob:') &&
                 (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
        })
        .map((imageUrl: string, index: number) => ({
          id: index.toString(),
          name: product.title || 'Imóvel',
          image: imageUrl,
        }))
    : [];

  // Se não há imagens válidas, usar imagem padrão
  const finalList = list.length > 0 ? list : [
    {
      id: '1',
      name: product.title || 'Imóvel',
      image: img.src, // Imagem padrão se não houver imagens válidas
    },
  ];

  const carouselSettings = {
    speed: 1000,
    dots: true,
    arrows: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({
      sx: {
        right: 24,
        bottom: 24,
        position: 'absolute',
        color: 'white',
      },
    }),
  };

  return (
    <Box sx={{ bgcolor: 'common.white', borderRadius: '10px', p: 1.25, color: '#454545' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: '15px',
            height: height || '250px',
          }}
        >
          <CarouselArrows filled shape="rounded" onNext={handleNext} onPrevious={handlePrev}>
            <Carousel ref={carouselRef} {...carouselSettings} arrows>
              {finalList.map((item) => (
                <CarouselItem key={item.id} item={item} height={height} product={product} />
              ))}
            </Carousel>
          </CarouselArrows>
        </Box>

        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 10, left: 10 }}>
          <RoundButton variant="contained" color="secondary" size="small">
            <Typography variant="overline" sx={{ textTransform: 'none' }}>
              {t(`card.featured`)}
            </Typography>
          </RoundButton>
          <RoundButton variant="contained" color="info" size="small">
            <Typography variant="overline" sx={{ textTransform: 'none' }}>
              {t(`card.buy`)}
            </Typography>
          </RoundButton>
        </Stack>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ position: 'absolute', bottom: 10, left: 15, color: 'white' }}
        >
          <HeartIcon />
          <BellIcon />
          <Typography variant="overline">{t(`card.buy`)}</Typography>
        </Stack>
      </Box>

      <Stack spacing={1.5} textAlign="start" sx={{ mt: 2 }}>
        <Typography variant="h4" color="primary">
          {product.title}
        </Typography>
        <Stack direction="row" justifyContent="flex-start" alignItems="start" spacing={2}>
          <LocationIcon />
          <Typography variant="body2" sx={{ maxWidth: '230px', color: 'text.secondary' }}>
            {product.address}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-start" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BedIcon />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`${product.features?.bedrooms || 0} ${t(`card.bedrooms`)}`}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BathIcon />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`${product.features?.bathroom || 0} ${t(`card.suite`)}`}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="flex-start" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CarIcon />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`${product.features?.vacancies || 0} ${t(`card.vacancies`)}`}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SquareIcon />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`${product.features?.area || 0}m² (${t(`card.usable_area`)})`}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ pt: 2 }}
        >
          <Typography variant="subtitle1" color="primary">
            {t(`card.from`)}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            R$
          </Typography>
          <Typography variant="h3" color="primary">
            {product.price}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

type CarouselItemProps = {
  item: ItemProps;
  height?: number;
  product: IProduct;
};

function CarouselItem({ item, height, product }: CarouselItemProps) {
  const { image, name } = item;

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        sx={{
          left: 0,
          bottom: 0,
          zIndex: 9,
          // maxWidth: '80%',
          position: 'absolute',
          color: 'common.white',
        }}
      />
      <StyledOverlay />
      <Link href={`${PATH_PAGE.buy}/${product.id}`}>
        <Image
          alt={name}
          src={image}
          sx={{
            height: height || 250,
            cursor: 'pointer',
          }}
        />
      </Link>
    </Box>
  );
}
