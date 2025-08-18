import { useRef } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocales } from 'src/locales';
import { PATH_PAGE } from 'src/routes/paths';
import Carousel, { CarouselDots } from 'src/components/carousel';
import img from 'src/assets/images/default-property.jpg';

// ----------------------------------------------------------------------

type EstateCardProps = {
  product: any;
  height?: string;
};

type CarouselItemProps = {
  item: {
    id: string;
    name: string;
    image: string;
  };
  height?: string;
  product: any;
};

function CarouselItem({ item, height, product }: CarouselItemProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: height || '250px',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.location.href = `${PATH_PAGE.buy}/${product.id}`;
      }}
    >
      <Box
        component="img"
        alt={item.name}
        src={item.image}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function EstateCard({ height, product }: EstateCardProps) {
  const theme = useTheme();
  const { t } = useLocales();
  const carouselRef = useRef<Carousel | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    carouselRef.current?.slickPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    carouselRef.current?.slickNext();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Só navega se o clique foi diretamente no card, não em elementos filhos
    if (e.currentTarget === e.target) {
      window.location.href = `${PATH_PAGE.buy}/${product.id}`;
    }
  };

  const list = product.images && product.images.length > 0 
    ? product.images
        .filter((imageUrl: string) => {
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

  const finalList = list.length > 0 ? list : [
    {
      id: '0',
      name: product.title || 'Imóvel',
      image: img.src,
    },
  ];

  const carouselSettings = {
    speed: 1000,
    dots: true,
    arrows: false,
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
    <Box 
      sx={{ 
        bgcolor: 'common.white', 
        borderRadius: '10px', 
        p: 1.25, 
        color: '#454545',
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: '15px',
            height: height || '250px',
          }}
        >
          <Carousel ref={carouselRef} {...carouselSettings}>
            {finalList.map((item) => (
              <CarouselItem key={item.id} item={item} height={height} product={product} />
            ))}
          </Carousel>
          
          {/* Setas do carrossel com interceptação completa de eventos */}
          {finalList.length > 1 && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                onClick={handlePrev}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <Typography color="white" sx={{ fontSize: '20px', fontWeight: 'bold' }}>‹</Typography>
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 16,
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                onClick={handleNext}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <Typography color="white" sx={{ fontSize: '20px', fontWeight: 'bold' }}>›</Typography>
              </Box>
            </>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 9,
          }}
        >
          <Chip
            variant="filled"
            size="small"
            label="Destaque"
            sx={{
              color: 'common.white',
              bgcolor: 'warning.main',
            }}
          />
          <Chip
            variant="filled"
            size="small"
            label={product.type || 'Comprar'}
            sx={{
              color: 'common.white',
              bgcolor: 'info.main',
            }}
          />
        </Stack>
      </Box>

      <Stack spacing={1} sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
          {product.title || 'Título não disponível'}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
          {product.address || 'Endereço não disponível'}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: '12px' }}>
              {product.features?.bedrooms || 0} Dormitórios
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: '12px' }}>
              {product.features?.bathrooms || 0} Suíte
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: '12px' }}>
              {product.features?.parking || 0} Vagas
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: '12px' }}>
              {product.features?.area || 0}m² (Área útil)
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '12px' }}>
            A partir de
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600 }}>
            R$ {product.price ? Number(product.price).toLocaleString('pt-BR') : '0'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

